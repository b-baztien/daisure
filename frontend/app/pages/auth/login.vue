<script setup lang="ts">
definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();
const toast = useToast();

const form = reactive({
  email: "",
  password: "",
});

const isLoading = ref(false);
const showPassword = ref(false);

// Handle email/password login
async function handleLogin() {
  if (!form.email || !form.password) {
    toast.add({
      title: "กรุณากรอกข้อมูล",
      description: "กรุณากรอกอีเมลและรหัสผ่าน",
      color: "red",
    });
    return;
  }

  isLoading.value = true;
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    toast.add({
      title: "เข้าสู่ระบบสำเร็จ",
      description: `ยินดีต้อนรับ ${authStore.displayName}`,
      color: "green",
    });

    // Redirect to dashboard or intended page
    const redirectTo = router.currentRoute.value.query.redirect as string;
    router.push(redirectTo || "/dashboard");
  } catch (error: any) {
    console.error("Login error:", error);
    toast.add({
      title: "เข้าสู่ระบบไม่สำเร็จ",
      description: error.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

// Handle LINE Login
function handleLineLogin() {
  const clientId = config.public.lineClientId;
  const redirectUri = config.public.lineRedirectUri;
  const state = Math.random().toString(36).substring(7);

  // Store state in sessionStorage for verification
  if (import.meta.client) {
    sessionStorage.setItem("line_login_state", state);
  }

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=profile%20openid%20email`;

  // Redirect to LINE Login
  window.location.href = lineAuthUrl;
}

// Check if already logged in
onMounted(async () => {
  // Wait for auth initialization
  if (!authStore.isInitialized) {
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (authStore.isInitialized) {
          clearInterval(checkInterval)
          resolve(true)
        }
      }, 50)

      setTimeout(() => {
        clearInterval(checkInterval)
        resolve(false)
      }, 2000)
    })
  }

  if (authStore.isAuthenticated) {
    router.push("/dashboard");
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4"
  >
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <NuxtLink to="/" class="inline-block mb-4"> DaiSure </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            เข้าสู่ระบบ
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            เข้าสู่ระบบเพื่อใช้งาน DaiSure
          </p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <UFormField label="อีเมล" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            size="lg"
            :disabled="isLoading"
            required
          />
        </UFormField>

        <!-- Password -->
        <UFormField label="รหัสผ่าน" required>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            size="lg"
            :disabled="isLoading"
            required
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-eye"
                :padded="false"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

        <!-- Forgot password link -->
        <div class="flex justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ลืมรหัสผ่าน?
          </NuxtLink>
        </div>

        <!-- Login button -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          :disabled="isLoading"
        >
          เข้าสู่ระบบ
        </UButton>

        <!-- Divider -->
        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-gray-500">
              หรือเข้าสู่ระบบด้วย
            </span>
          </div>
        </div>

        <!-- LINE Login button -->
        <UButton
          color="green"
          variant="outline"
          block
          size="lg"
          :disabled="isLoading || !config.public.lineClientId"
          @click="handleLineLogin"
        >
          <template #leading>
            <Icon name="i-simple-icons-line" class="w-5 h-5" />
          </template>
          เข้าสู่ระบบด้วย LINE
        </UButton>

        <!-- Register link -->
        <div class="text-center pt-4">
          <span class="text-gray-600 dark:text-gray-400"> ยังไม่มีบัญชี? </span>
          <NuxtLink
            to="/auth/register"
            class="ml-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
          >
            สมัครสมาชิก
          </NuxtLink>
        </div>
      </form>
    </UCard>
  </div>
</template>
