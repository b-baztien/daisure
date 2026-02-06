import type { CustomFetchOptions } from "~/types/customFetchOptions";

export const useDashboardService = () => {
  return {
    getDashboardStats: (options: CustomFetchOptions = {}) => {
      return useCustomFetch("/admin/dashboard", {
        method: "GET",
        ...options,
      });
    },
  };
};
