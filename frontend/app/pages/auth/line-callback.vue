<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const isProcessing = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    // Get code and state from query params
    const code = route.query.code as string
    const state = route.query.state as string
    const error = route.query.error as string
    const errorDescription = route.query.error_description as string

    // Check for errors from LINE
    if (error) {
      throw new Error(errorDescription || 'LINE login failed')
    }

    // Validate code and state
    if (!code || !state) {
      throw new Error('Missing authorization code or state')
    }

    // Verify state
    const storedState = sessionStorage.getItem('line_login_state')
    if (state !== storedState) {
      throw new Error('Invalid state parameter')
    }

    // Clear stored state
    sessionStorage.removeItem('line_login_state')

    // Call LINE login API
    await authStore.loginWithLine(code, state)

    toast.add({
      title: 'เข้าสู่ระบบสำเร็จ',
      description: `ยินดีต้อนรับ ${authStore.displayName}`,
      color: 'green'
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error: any) {
    console.error('LINE callback error:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย LINE'

    toast.add({
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      description: errorMessage.value,
      color: 'red'
    })

    // Redirect to login page after 3 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  } finally {
    isProcessing.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
    <UCard class="w-full max-w-md">
      <div class="text-center py-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <AppLogo class="h-12" />
        </NuxtLink>

        <!-- Processing state -->
        <div v-if="isProcessing">
          <div class="flex justify-center mb-4">
            <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            กำลังเข้าสู่ระบบ...
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            กรุณารอสักครู่
          </p>
        </div>

        <!-- Error state -->
        <div v-else-if="errorMessage">
          <div class="flex justify-center mb-4">
            <Icon name="i-heroicons-x-circle" class="w-12 h-12 text-red-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            เข้าสู่ระบบไม่สำเร็จ
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ errorMessage }}
          </p>
          <UButton
            to="/auth/login"
            block
            size="lg"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </UButton>
        </div>

        <!-- Success state -->
        <div v-else>
          <div class="flex justify-center mb-4">
            <Icon name="i-heroicons-check-circle" class="w-12 h-12 text-green-600" />
          </div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            เข้าสู่ระบบสำเร็จ
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            กำลังนำคุณไปยังหน้าหลัก...
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
