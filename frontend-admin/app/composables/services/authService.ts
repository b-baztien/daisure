import type { CustomFetchOptions } from "~/types/customFetchOptions";

export const useAuthService = () => {
  return {
    login: (options: CustomFetchOptions = {}) => {
      return useCustomFetch("auth/login", {
        method: "POST",
        ...options,
      });
    },
  };
};
