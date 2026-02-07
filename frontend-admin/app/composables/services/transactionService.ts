export const useTransactionService = () => {
  return {
    getTransactions: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<ResponsePagination<Transaction>>("/transactions", {
        method: "GET",
        ...options,
      });
    },
  };
};
