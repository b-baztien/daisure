<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <UButton
        :to="`/payments/${route.params.id}/instructions`"
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        class="mb-4"
      >
        กลับ
      </UButton>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        อัพโหลดสลิปการโอน
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        อัพโหลดหลักฐานการโอนเงินของคุณ
      </p>
    </div>

    <UForm :state="form" @submit="onSubmit" class="space-y-6">
      <!-- Slip Upload -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">สลิปการโอน</h2>
        </template>

        <div class="space-y-4">
          <!-- Upload Input -->
          <UFormField label="อัพโหลดรูปสลิป" required>
            <UInput
              v-model="slipUrl"
              placeholder="URL ของรูปสลิป"
              @keyup.enter="addSlip"
            />
            <template #hint>
              <span class="text-sm">รองรับ JPG, PNG ขนาดไม่เกิน 5MB</span>
            </template>
          </UFormField>

          <!-- Preview -->
          <div v-if="form.slipImages.length > 0" class="grid grid-cols-2 gap-4">
            <div
              v-for="(img, index) in form.slipImages"
              :key="index"
              class="relative group"
            >
              <img
                :src="img"
                class="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
              />
              <UButton
                color="red"
                size="sm"
                icon="i-heroicons-x-mark"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                @click="removeSlip(index)"
              />
            </div>
          </div>

          <UAlert
            v-if="form.slipImages.length === 0"
            color="blue"
            variant="soft"
          >
            <template #description>
              กรุณาอัพโหลดสลิปการโอนเงินอย่างน้อย 1 รูป
            </template>
          </UAlert>
        </div>
      </UCard>

      <!-- Payment Details -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">รายละเอียดการโอน</h2>
        </template>

        <div class="space-y-4">
          <!-- Payment Method -->
          <UFormField label="วิธีการชำระเงิน" required>
            <USelectMenu
              v-model="form.method"
              :options="paymentMethods"
              placeholder="เลือกวิธีการชำระเงิน"
            />
          </UFormField>

          <!-- Amount -->
          <UFormField label="จำนวนเงินที่โอน (บาท)" required>
            <UInput
              v-model.number="form.paidAmount"
              type="number"
              placeholder="36100"
              size="lg"
            >
              <template #leading>
                <span class="text-gray-500">฿</span>
              </template>
            </UInput>
          </UFormField>

          <!-- Note -->
          <UFormField label="หมายเหตุ">
            <UTextarea
              v-model="form.note"
              placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
              :rows="3"
            />
          </UFormField>
        </div>
      </UCard>

      <!-- Warning -->
      <UAlert
        color="yellow"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
      >
        <template #title> กรุณาตรวจสอบข้อมูล </template>
        <template #description>
          - ตรวจสอบจำนวนเงินให้ถูกต้อง<br />
          - รูปสลิปต้องชัดเจน อ่านได้<br />
          - Admin จะตรวจสอบภายใน 24 ชั่วโมง
        </template>
      </UAlert>

      <!-- Submit -->
      <div class="flex gap-4">
        <UButton
          type="submit"
          size="lg"
          block
          :loading="isLoading"
          :disabled="form.slipImages.length === 0"
        >
          ยืนยันการโอนเงิน
        </UButton>
        <UButton
          :to="`/payments/${route.params.id}/instructions`"
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
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const toast = useToast();

const form = reactive({
  transactionId: route.params.id as string,
  method: "bank_transfer",
  slipImages: [] as string[],
  paidAmount: null as number | null,
  note: "",
});

const slipUrl = ref("");
const isLoading = ref(false);

const paymentMethods = [
  { label: "โอนผ่านธนาคาร", value: "bank_transfer" },
  { label: "พร้อมเพย์", value: "promptpay" },
  { label: "Mobile Banking", value: "mobile_banking" },
];

const addSlip = () => {
  if (slipUrl.value) {
    form.slipImages.push(slipUrl.value);
    slipUrl.value = "";
  }
};

const removeSlip = (index: number) => {
  form.slipImages.splice(index, 1);
};

const onSubmit = async () => {
  if (form.slipImages.length === 0) {
    toast.add({
      title: "กรุณาอัพโหลดสลิป",
      description: "อัพโหลดรูปสลิปการโอนอย่างน้อย 1 รูป",
      color: "red",
    });
    return;
  }

  if (!form.paidAmount) {
    toast.add({
      title: "กรุณาระบุจำนวนเงิน",
      color: "red",
    });
    return;
  }

  isLoading.value = true;
  try {
    await paymentStore.submitPayment(form);

    toast.add({
      title: "ส่งหลักฐานสำเร็จ",
      description: "รอ Admin ตรวจสอบภายใน 24 ชั่วโมง",
      color: "green",
    });

    router.push(`/transactions/${route.params.id}`);
  } catch (error: any) {
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: error.data?.message || "ไม่สามารถส่งข้อมูลได้",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
