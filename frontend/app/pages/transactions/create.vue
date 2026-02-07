<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <UButton
        to="/transactions"
        color="neutral"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        สร้างรายการซื้อขาย
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        กรอกข้อมูลสินค้าที่ต้องการขาย
      </p>
    </div>

    <UForm :state="form" @submit="onSubmit" class="space-y-6">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">ข้อมูลสินค้า</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UFormField label="ชื่อสินค้า" required>
            <UInput
              class="w-full"
              v-model="form.product.name"
              placeholder="iPhone 15 Pro 256GB"
            />
          </UFormField>

          <UFormField label="หมวดหมู่">
            <USelectMenu
              class="w-full"
              v-model="form.product.category"
              :items="categories"
              placeholder="เลือกหมวดหมู่"
            />
          </UFormField>

          <UFormField label="ราคา (บาท)" required>
            <UInput
              v-model.number="form.product.price"
              type="number"
              placeholder="35000"
            >
              <template #leading>
                <span class="text-gray-500">฿</span>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="ลิงค์ต้นทาง">
            <UInput
              v-model="form.product.sourceUrl"
              placeholder="https://facebook.com/..."
            />
          </UFormField>

          <UFormField class="col-span-full" label="รายละเอียด" required>
            <UTextarea
              v-model="form.product.description"
              class="w-full"
              placeholder="อธิบายรายละเอียดสินค้า..."
            />
          </UFormField>

          <UFormField class="col-span-full" label="รูปภาพสินค้า" required>
            <UInput
              class="w-full"
              v-model="imageUrl"
              placeholder="URL รูปภาพ"
              @keyup.enter="addImage"
            />
            <div
              v-if="form.product.images.length > 0"
              class="grid grid-cols-4 gap-4 mt-4"
            >
              <div
                v-for="(img, index) in form.product.images"
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
          </UFormField>
        </div>
      </UCard>

      <!-- Seller Info (auto-populated from logged-in user) -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">ข้อมูลผู้ขาย</h2>
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <UAvatar
              :src="authStore.user?.profile?.pictureUrl"
              :alt="authStore.user?.profile?.displayName"
              size="lg"
            />
            <div>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ authStore.user?.profile?.displayName || '-' }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ authStore.user?.auth?.email || authStore.user?.profile?.email || '-' }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">เบอร์โทร</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ authStore.user?.profile?.phone || 'ยังไม่ได้ระบุ' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">คะแนนผู้ขาย</p>
              <p class="font-medium text-gray-900 dark:text-white">
                <template v-if="authStore.user?.rating?.asSeller?.count > 0">
                  {{ authStore.user.rating.asSeller.average.toFixed(1) }} / 5
                  ({{ authStore.user.rating.asSeller.count }} รีวิว)
                </template>
                <template v-else>
                  ยังไม่มีรีวิว
                </template>
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Shipping Fee -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">ค่าจัดส่ง</h2>
        </template>

        <UFormField label="ค่าจัดส่ง (บาท)">
          <UInput
            v-model.number="form.shippingFee"
            type="number"
            placeholder="50"
          >
            <template #leading>
              <span class="text-gray-500">฿</span>
            </template>
          </UInput>
        </UFormField>
      </UCard>

      <!-- Summary -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">สรุปยอดชำระ</h2>
        </template>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">ราคาสินค้า</span>
            <span class="font-semibold"
              >฿{{ formatNumber(form.product.price || 0) }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">ค่าธรรมเนียม (3%)</span>
            <span class="font-semibold">฿{{ formatNumber(escrowFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">ค่าจัดส่ง</span>
            <span class="font-semibold"
              >฿{{ formatNumber(form.shippingFee || 0) }}</span
            >
          </div>
          <UDivider />
          <div class="flex justify-between text-lg">
            <span class="font-semibold">รวมทั้งสิ้น</span>
            <span class="font-bold text-blue-600"
              >฿{{ formatNumber(totalAmount) }}</span
            >
          </div>
        </div>
      </UCard>

      <!-- Submit -->
      <div class="flex gap-4">
        <UButton type="submit" block :loading="isLoading">
          สร้างรายการ
        </UButton>
        <UButton to="/transactions" color="neutral" variant="outline">
          ยกเลิก
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
const transactionStore = useTransactionStore();
const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const form = reactive({
  product: {
    name: "",
    description: "",
    category: "",
    images: [] as string[],
    price: null as number | null,
    sourceUrl: "",
  },
  shippingFee: 0,
});

const imageUrl = ref("");
const isLoading = ref(false);

const categories = [
  "มือถือ",
  "คอมพิวเตอร์",
  "เครื่องใช้ไฟฟ้า",
  "แฟชั่น",
  "อื่นๆ",
];

const escrowFee = computed(() => {
  if (!form.product.price) return 0;
  return Math.round(form.product.price * 0.03);
});

const totalAmount = computed(() => {
  const price = form.product.price || 0;
  const shipping = form.shippingFee || 0;
  return price + escrowFee.value + shipping;
});

const addImage = () => {
  if (imageUrl.value) {
    form.product.images.push(imageUrl.value);
    imageUrl.value = "";
  }
};

const removeImage = (index: number) => {
  form.product.images.splice(index, 1);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num);
};

const onSubmit = async () => {
  // Validation
  if (!form.product.name || !form.product.description || !form.product.price) {
    toast.add({
      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
      color: "red",
    });
    return;
  }

  if (form.product.images.length === 0) {
    toast.add({
      title: "กรุณาเพิ่มรูปภาพสินค้าอย่างน้อย 1 รูป",
      color: "red",
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      product: form.product,
      shippingFee: form.shippingFee,
    };

    const transaction = await transactionStore.createTransaction(payload);

    toast.add({
      title: "สร้างรายการสำเร็จ",
      description: `เลขที่รายการ: ${transaction.transactionNumber}`,
      color: "green",
    });

    router.push(`/transactions/${transaction.id}`);
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถสร้างรายการได้",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
