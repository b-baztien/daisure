import type { CustomFetchOptions } from "~/types/customFetchOptions";
import type { DashboardStats } from "~/types/dashboardStats";

export const useDashboardService = () => {
  return {
    getDashboardStats: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<DashboardStats>("/admin/dashboard", {
        method: "GET",
        ...options,
      });
    },
  };
};
