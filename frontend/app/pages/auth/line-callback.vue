<template>
  <div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4"
  >
    <UCard class="w-full max-w-md">
      <div class="text-center py-8">
        <NuxtLink to="/" class="inline-block mb-6"> DaiSure </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();

const alert = useAlert();

const code = useRouteQuery<string>("code");
const state = useRouteQuery<string>("state");
const error = useRouteQuery<string>("error");
const errorDescription = useRouteQuery<string>("error_description");

onMounted(async () => {
  if (error.value) {
    alert.error(
      `เข้าสู่ระบบไม่สำเร็จ: ${errorDescription.value || "เกิดข้อผิดพลาด"}`,
    );
    return navigateTo("/auth/login");
  }

  if (!code.value || !state.value) {
    alert.error("เข้าสู่ระบบไม่สำเร็จ: ข้อมูลไม่ครบถ้วน");
    return navigateTo("/auth/login");
  }

  const storedState = sessionStorage.getItem("line_login_state");
  if (state.value !== storedState) {
    alert.error("เข้าสู่ระบบไม่สำเร็จ: ข้อมูลไม่ถูกต้อง");
    return navigateTo("/auth/login");
  }

  sessionStorage.removeItem("line_login_state");

  const payload = {
    code: code.value,
    state: state.value,
  };

  const { execute, error: loginError } = useAuthService().loginWithLine({
    body: payload,
    immediate: false,
  });

  await execute();

  if (loginError.value) {
    useAlert(loginError.value);
    return navigateTo("/auth/login");
  }

  alert.success(`ยินดีต้อนรับ ${authStore.displayName}`);
  return navigateTo("/dashboard");
});
</script>
