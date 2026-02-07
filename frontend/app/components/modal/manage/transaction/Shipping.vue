<template>
  <UModal title="บันทึกข้อมูลการจัดส่ง">
    <template #body>
      <UForm :state="shippingForm" @submit="submitShipping" class="space-y-4">
        <UFormField label="วิธีการจัดส่ง" required>
          <USelectMenu
            v-model="shippingForm.method"
            :options="shippingMethods"
            placeholder="เลือกบริษัทขนส่ง"
          />
        </UFormField>

        <UFormField label="หมายเลขพัสดุ" required>
          <UInput
            v-model="shippingForm.trackingNumber"
            placeholder="KRYTH123456789"
          />
        </UFormField>

        <UFormField label="ลิงค์ติดตามพัสดุ">
          <UInput
            v-model="shippingForm.trackingUrl"
            placeholder="https://track.kerryexpress.com/..."
          />
        </UFormField>

        <div class="flex gap-2 justify-end">
          <UButton color="neutral" variant="outline" @click="emit('close')">
            ยกเลิก
          </UButton>
          <UButton type="submit"> บันทึก </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const alert = useAlert();

const shippingMethods = [
  "Kerry Express",
  "Flash Express",
  "Thailand Post",
  "J&T Express",
  "Lalamove",
];

const emit = defineEmits(["close"]);

const shippingForm = reactive({
  method: "",
  trackingNumber: "",
  trackingUrl: "",
});

const submitShipping = async () => {
  if (!shippingForm.method || !shippingForm.trackingNumber) {
    alert.error("กรุณากรอกข้อมูลให้ครบถ้วน");

    return;
  }

  // TODO: Call API to update shipping info
  await new Promise((resolve) => setTimeout(resolve, 1000));

  alert.success("บันทึกข้อมูลการจัดส่งเรียบร้อยแล้ว");

  emit("close", true);
  return;
};
</script>
