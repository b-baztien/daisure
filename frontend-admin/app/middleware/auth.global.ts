const skipPaths = ["/login"];

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (skipPaths.includes(to.path)) {
    return;
  }

  const authStore = useAuth();

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
