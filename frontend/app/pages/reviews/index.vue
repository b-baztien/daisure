<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        รีวิวของฉัน
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        ดูรีวิวที่คุณได้รับและที่คุณเขียน
      </p>
    </div>

    <!-- Stats -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <div class="text-center">
          <div class="text-4xl font-bold text-yellow-600 mb-2">
            {{ averageRating }}
          </div>
          <div class="flex justify-center gap-1 mb-2">
            <UIcon
              v-for="i in 5"
              :key="i"
              name="i-heroicons-star-solid"
              class="w-5 h-5"
              :class="
                i <= Math.round(Number(averageRating))
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">คะแนนเฉลี่ย</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <div class="text-4xl font-bold text-blue-600 mb-2">
            {{ reviewCount }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">รีวิวที่ได้รับ</p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <div class="text-4xl font-bold text-green-600 mb-2">
            {{ reviews.filter((r) => r.rating >= 4).length }}
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            รีวิวดี (4-5 ดาว)
          </p>
        </div>
      </UCard>
    </div>

    <!-- Tabs -->
    <UTabs :items="tabs" class="mb-6">
      <!-- Received Reviews -->
      <template #received>
        <div v-if="isLoading" class="space-y-4">
          <USkeleton class="h-32" v-for="i in 3" :key="i" />
        </div>

        <div v-else-if="reviews.length > 0" class="space-y-4">
          <UCard v-for="review in reviews" :key="review.id">
            <div class="flex items-start gap-4">
              <UAvatar
                :alt="review.reviewer.displayName"
                :src="review.reviewer.pictureUrl"
                size="lg"
              />

              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-semibold">
                      {{ review.reviewer.displayName }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex gap-1">
                        <UIcon
                          v-for="i in 5"
                          :key="i"
                          name="i-heroicons-star-solid"
                          class="w-4 h-4"
                          :class="
                            i <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          "
                        />
                      </div>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ formatDate(review.createdAt) }}
                      </span>
                    </div>
                  </div>
                </div>

                <p class="text-gray-700 dark:text-gray-300 mb-3">
                  {{ review.comment }}
                </p>

                <div
                  v-if="review.images?.length"
                  class="grid grid-cols-4 gap-2 mb-3"
                >
                  <img
                    v-for="(img, index) in review.images"
                    :key="index"
                    :src="img"
                    class="w-full h-20 object-cover rounded-lg"
                  />
                </div>

                <UButton
                  v-if="!review.response"
                  color="gray"
                  variant="outline"
                  size="sm"
                  @click="openResponseModal(review.id)"
                >
                  ตอบกลับ
                </UButton>

                <div
                  v-else
                  class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <p class="text-sm font-semibold mb-1">การตอบกลับของคุณ:</p>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    {{ review.response.comment }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatDate(review.response.respondedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <UCard v-else>
          <div class="text-center py-12">
            <UIcon
              name="i-heroicons-star"
              class="w-16 h-16 mx-auto mb-4 text-gray-400"
            />
            <p class="text-gray-600 dark:text-gray-400">คุณยังไม่มีรีวิว</p>
          </div>
        </UCard>
      </template>

      <!-- Given Reviews -->
      <template #given>
        <div class="text-center py-12 text-gray-600 dark:text-gray-400">
          รีวิวที่คุณเขียน
        </div>
      </template>
    </UTabs>

    <!-- Response Modal -->
    <UModal v-model="showResponseModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">ตอบกลับรีวิว</h3>
        </template>

        <UForm :state="responseForm" @submit="submitResponse" class="space-y-4">
          <UFormGroup label="ข้อความตอบกลับ" required>
            <UTextarea
              v-model="responseForm.comment"
              placeholder="ขอบคุณสำหรับรีวิว..."
              :rows="4"
            />
          </UFormGroup>

          <div class="flex gap-2 justify-end">
            <UButton
              color="gray"
              variant="outline"
              @click="showResponseModal = false"
            >
              ยกเลิก
            </UButton>
            <UButton type="submit" :loading="isResponding"> ส่งคำตอบ </UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const reviewStore = useReviewStore();
const toast = useToast();

const { reviews, isLoading, averageRating, reviewCount } =
  storeToRefs(reviewStore);

const tabs = [
  { key: "received", label: "รีวิวที่ได้รับ" },
  { key: "given", label: "รีวิวที่เขียน" },
];

const showResponseModal = ref(false);
const selectedReviewId = ref("");
const isResponding = ref(false);

const responseForm = reactive({
  comment: "",
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const openResponseModal = (reviewId: string) => {
  selectedReviewId.value = reviewId;
  showResponseModal.value = true;
  responseForm.comment = "";
};

const submitResponse = async () => {
  if (!responseForm.comment) {
    toast.add({
      title: "กรุณากรอกข้อความ",
      color: "red",
    });
    return;
  }

  isResponding.value = true;
  try {
    await reviewStore.addResponse(selectedReviewId.value, responseForm.comment);

    toast.add({
      title: "ตอบกลับสำเร็จ",
      color: "green",
    });

    showResponseModal.value = false;
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถส่งคำตอบได้",
      color: "red",
    });
  } finally {
    isResponding.value = false;
  }
};

onMounted(() => {
  reviewStore.fetchReviews();
});
</script>
