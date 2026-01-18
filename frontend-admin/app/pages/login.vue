<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Panel
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to your admin account
        </p>
      </div>

      <UCard>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="admin@example.com"
              icon="i-heroicons-envelope"
              required
            />
          </UFormField>

          <UFormField label="Password" name="password" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
              required
            />
          </UFormField>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            :disabled="loading"
          >
            Sign In
          </UButton>

          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            :title="error"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
            @close="error = ''"
          />
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
