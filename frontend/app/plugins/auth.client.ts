export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage on app start (client-side only)
  authStore.initAuth()

  // Fetch fresh user data if token exists
  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
