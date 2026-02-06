import type { CustomFetchOptions } from "~/types/customFetchOptions";

export const useAuthService = () => {
  return {
    loginWithLine: (
      options: CustomFetchOptions<{ code: string; state: string }> = {},
    ) => {
      return useCustomFetch("/auth/line/login", {
        method: "POST",
        ...options,
      });
    },
    getProfile: (options: CustomFetchOptions = {}) => {
      return useCustomFetch("/users/me", {
        method: "GET",
        ...options,
      });
    },
  };
};
