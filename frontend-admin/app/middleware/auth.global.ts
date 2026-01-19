export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // Initialize auth state if not already done
  if (!authStore.token && import.meta.client) {
    await authStore.initAuth()
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check if user has admin privileges
  if (!authStore.isAdmin) {
    console.error('Access denied: Admin privileges required')
    authStore.logout()
    return navigateTo('/login')
  }
})
