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
  confirmPassword: "",
  displayName: "",
  phone: "",
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation
const emailError = computed(() => {
  if (!form.email) return "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(form.email) ? "" : "รูปแบบอีเมลไม่ถูกต้อง";
});

const passwordError = computed(() => {
  if (!form.password) return "";
  return form.password.length >= 6 ? "" : "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
});

const confirmPasswordError = computed(() => {
  if (!form.confirmPassword) return "";
  return form.password === form.confirmPassword ? "" : "รหัสผ่านไม่ตรงกัน";
});

const displayNameError = computed(() => {
  if (!form.displayName) return "";
  return form.displayName.length >= 2
    ? ""
    : "ชื่อที่แสดงต้องมีอย่างน้อย 2 ตัวอักษร";
});

const isFormValid = computed(() => {
  return (
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.displayName &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    !displayNameError.value
  );
});

// Handle registration
async function handleRegister() {
  if (!isFormValid.value) {
    toast.add({
      title: "กรุณาตรวจสอบข้อมูล",
      description: "กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน",
      color: "red",
    });
    return;
  }

  isLoading.value = true;
  try {
    await authStore.register({
      email: form.email,
      password: form.password,
      displayName: form.displayName,
      phone: form.phone || undefined,
    });

    toast.add({
      title: "สมัครสมาชิกสำเร็จ",
      description: `ยินดีต้อนรับ ${authStore.displayName}`,
      color: "green",
    });

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error: any) {
    console.error("Register error:", error);
    toast.add({
      title: "สมัครสมาชิกไม่สำเร็จ",
      description: error.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
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
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push("/dashboard");
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8"
  >
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <NuxtLink to="/" class="inline-block mb-4"> DaiSure </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            สมัครสมาชิก
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            สร้างบัญชีเพื่อเริ่มใช้งาน DaiSure
          </p>
        </div>
      </template>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Display Name -->
        <UFormGroup label="ชื่อที่แสดง" required :error="displayNameError">
          <UInput
            v-model="form.displayName"
            type="text"
            placeholder="ชื่อที่จะแสดงในระบบ"
            size="lg"
            :disabled="isLoading"
            required
          />
        </UFormGroup>

        <!-- Email -->
        <UFormGroup label="อีเมล" required :error="emailError">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            size="lg"
            :disabled="isLoading"
            required
          />
        </UFormGroup>

        <!-- Phone (optional) -->
        <UFormGroup label="เบอร์โทรศัพท์ (ไม่บังคับ)">
          <UInput
            v-model="form.phone"
            type="tel"
            placeholder="0812345678"
            size="lg"
            :disabled="isLoading"
          />
        </UFormGroup>

        <!-- Password -->
        <UFormGroup label="รหัสผ่าน" required :error="passwordError">
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
          <template #help>
            <span class="text-xs text-gray-500"
              >รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</span
            >
          </template>
        </UFormGroup>

        <!-- Confirm Password -->
        <UFormGroup
          label="ยืนยันรหัสผ่าน"
          required
          :error="confirmPasswordError"
        >
          <UInput
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
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
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormGroup>

        <!-- Terms acceptance -->
        <div class="text-sm text-gray-600 dark:text-gray-400">
          เมื่อสมัครสมาชิก แสดงว่าคุณยอมรับ
          <NuxtLink to="/terms" class="text-blue-600 hover:text-blue-500">
            ข้อกำหนดการใช้งาน
          </NuxtLink>
          และ
          <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-500">
            นโยบายความเป็นส่วนตัว
          </NuxtLink>
        </div>

        <!-- Register button -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          :disabled="isLoading || !isFormValid"
        >
          สมัครสมาชิก
        </UButton>

        <!-- Divider -->
        <div class="relative py-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-gray-500">
              หรือสมัครด้วย
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
          สมัครด้วย LINE
        </UButton>

        <!-- Login link -->
        <div class="text-center pt-4">
          <span class="text-gray-600 dark:text-gray-400">
            มีบัญชีอยู่แล้ว?
          </span>
          <NuxtLink
            to="/auth/login"
            class="ml-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
          >
            เข้าสู่ระบบ
          </NuxtLink>
        </div>
      </form>
    </UCard>
  </div>
</template>
