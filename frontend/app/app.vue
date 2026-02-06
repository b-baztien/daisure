<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <ModalLoading />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const profileStore = useProfileStore();
const { fetchProfile } = profileStore;
const { profile } = storeToRefs(profileStore);
const { isAuthenticated } = useAuth();

onMounted(async () => {
  if (!profile.value && isAuthenticated.value) {
    await fetchProfile();
  }
});
</script>
