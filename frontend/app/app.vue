<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
  </UApp>
</template>

<script setup lang="ts">
// Initialize auth on app startup
const authStore = useAuthStore();

onMounted(() => {
  // Initialize auth from localStorage
  authStore.initAuth();

  // Fetch fresh user data if token exists
  if (authStore.isAuthenticated) {
    authStore.fetchUser();
  }
});
</script>
