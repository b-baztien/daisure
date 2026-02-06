import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<User>();

  const { data, execute: executeProfile } = useAuthService().getProfile({
    immediate: false,
    loading: false,
    error: false,
  });

  const fetchProfile = async () => {
    await executeProfile();
    profile.value = data.value;
  };

  return {
    profile,
    fetchProfile,
  };
});
