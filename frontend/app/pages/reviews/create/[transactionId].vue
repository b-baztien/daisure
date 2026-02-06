<template>
  <div class="max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <UButton
        :to="`/transactions/${route.params.transactionId}`"
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        เขียนรีวิว
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        แบ่งปันประสบการณ์การซื้อขายของคุณ
      </p>
    </div>

    <UForm :state="form" @submit="onSubmit" class="space-y-6">
      <!-- Rating -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">คะแนน</h2>
        </template>

        <div class="text-center py-6">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            คุณให้คะแนนการซื้อขายนี้เท่าไหร่?
          </p>

          <!-- Star Rating -->
          <div class="flex justify-center gap-2 mb-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="form.rating = star"
              class="transition-transform hover:scale-110"
            >
              <UIcon
                :name="
                  star <= form.rating
                    ? 'i-heroicons-star-solid'
                    : 'i-heroicons-star'
                "
                class="w-12 h-12"
                :class="
                  star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                "
              />
            </button>
          </div>

          <p class="text-2xl font-bold text-yellow-600">
            {{ getRatingText(form.rating) }}
          </p>
        </div>
      </UCard>

      <!-- Comment -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">ความคิดเห็น</h2>
        </template>

        <UFormField label="เขียนรีวิว" required>
          <UTextarea
            v-model="form.comment"
            placeholder="บอกเล่าประสบการณ์การซื้อขายของคุณ..."
            :rows="6"
          />
          <template #hint>
            <span class="text-sm"
              >{{ form.comment.length }} / 500 ตัวอักษร</span
            >
          </template>
        </UFormField>
      </UCard>

      <!-- Images (Optional) -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">รูปภาพ (ถ้ามี)</h2>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="imageUrl"
            placeholder="URL รูปภาพ"
            @keyup.enter="addImage"
          />

          <div v-if="form.images.length > 0" class="grid grid-cols-4 gap-4">
            <div
              v-for="(img, index) in form.images"
              :key="index"
              class="relative group"
            >
              <img :src="img" class="w-full h-24 object-cover rounded-lg" />
              <UButton
                color="red"
                size="xs"
                icon="i-heroicons-x-mark"
                class="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                @click="removeImage(index)"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Submit -->
      <div class="flex gap-4">
        <UButton
          type="submit"
          size="lg"
          block
          :loading="isLoading"
          :disabled="!form.rating || !form.comment"
        >
          ส่งรีวิว
        </UButton>
        <UButton
          :to="`/transactions/${route.params.transactionId}`"
          color="gray"
          variant="outline"
          size="lg"
        >
          ยกเลิก
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();
const toast = useToast();

const form = reactive({
  transactionId: route.params.transactionId as string,
  rating: 0,
  comment: "",
  images: [] as string[],
});

const imageUrl = ref("");
const isLoading = ref(false);

const getRatingText = (rating: number) => {
  const texts = {
    1: "แย่มาก",
    2: "ไม่ค่อยดี",
    3: "ปานกลาง",
    4: "ดี",
    5: "ดีมาก",
  };
  return texts[rating] || "เลือกคะแนน";
};

const addImage = () => {
  if (imageUrl.value) {
    form.images.push(imageUrl.value);
    imageUrl.value = "";
  }
};

const removeImage = (index: number) => {
  form.images.splice(index, 1);
};

const onSubmit = async () => {
  if (!form.rating) {
    toast.add({
      title: "กรุณาให้คะแนน",
      color: "red",
    });
    return;
  }

  if (form.comment.length < 10) {
    toast.add({
      title: "กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร",
      color: "red",
    });
    return;
  }

  isLoading.value = true;
  try {
    await reviewStore.createReview(form);

    toast.add({
      title: "ส่งรีวิวสำเร็จ",
      description: "ขอบคุณสำหรับความคิดเห็น",
      color: "green",
    });

    router.push("/reviews");
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถส่งรีวิวได้",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
