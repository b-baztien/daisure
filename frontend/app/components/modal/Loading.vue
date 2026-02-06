<template>
  <UModal
    v-model:open="loading"
    dismissible
    :ui="{
      content: 'bg-transparent shadow-none ring-0',
    }"
  >
    <template #content>
      <div class="flex flex-col items-center justify-center text-primary">
        <UIcon name="i-eos-icons-three-dots-loading" class="text-9xl" />
        <p class="text-lg text-primary-300">กำลังโหลด...</p>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { loading } = storeToRefs(useLoadingStore());
</script>
