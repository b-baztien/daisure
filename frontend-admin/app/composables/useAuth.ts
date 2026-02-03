export const useAuth = () => {
  const accessToken = useCookie<string>("access_token");

  const refreshToken = useCookie<string>("verify_token");

  const setAccessToken = (value: string) => {
    accessToken.value = value;
  };

  const setRefreshToken = (value: string) => {
    refreshToken.value = value;
  };

  const clearAllTokens = () => {
    accessToken.value = "";
    refreshToken.value = "";
  };

  const isAuthenticated = computed(() => !!accessToken.value);

  return {
    accessToken,
    refreshToken,
    setRefreshToken,
    setAccessToken,
    clearAllTokens,
    isAuthenticated,
  };
};
