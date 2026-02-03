<template>
  <UModal :title="title" :description="description">
    <template #footer>
      <div class="flex w-full justify-end gap-4">
        <UButton
          class="text-neutral-700 rounded-lg"
          size="md"
          :label="cancelLabel"
          color="neutral"
          @click="emit('close')"
        />
        <UButton
          :label="confirmLabel"
          size="md"
          variant="solid"
          color="primary"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "ยืนยัน",
  },
  description: {
    type: String,
    default: "คุณแน่ใจหรือไม่ที่จะทำการยืนยัน?",
  },
  confirmLabel: {
    type: String,
    default: "ยืนยัน",
  },
  cancelLabel: {
    type: String,
    default: "ยกเลิก",
  },
});

const emit = defineEmits(["close"]);
</script>

<style></style>
