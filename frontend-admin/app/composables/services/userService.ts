export const useUserService = () => {
  return {
    getUsers: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<PaginatedResponse<User>>("/users", {
        method: "GET",
        ...options,
      });
    },
  };
};
