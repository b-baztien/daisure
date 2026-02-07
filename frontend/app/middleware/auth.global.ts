export default defineNuxtRouteMiddleware((to) => {
  const skipPath = ["/auth/login", "/auth/register", "/auth/line-callback"];

  if (skipPath.includes(to.path) || to.path.startsWith("/share/")) {
    return;
  }

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo("/auth/login");
  }

  return;
});
