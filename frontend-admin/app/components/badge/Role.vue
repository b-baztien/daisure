<template>
  <UBadge :color="roleColor" variant="subtle">
    {{ role?.toUpperCase() }}
  </UBadge>
</template>

<script setup lang="ts">
const props = defineProps<{ role: string }>();

const roleColor = computed(() => {
  switch (props.role) {
    case "buyer":
    case "seller":
      return "info";
    case "admin":
      return "warning";
    default:
      return "error";
  }
});
</script>
