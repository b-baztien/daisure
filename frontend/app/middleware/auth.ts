export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Wait for auth initialization to complete (only on client side)
  if (!authStore.isInitialized && import.meta.client) {
    // Wait for a short time for initialization to complete
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (authStore.isInitialized) {
          clearInterval(checkInterval)
          resolve(true)
        }
      }, 50)

      // Timeout after 2 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        resolve(false)
      }, 2000)
    })
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Store the intended destination
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }
})
