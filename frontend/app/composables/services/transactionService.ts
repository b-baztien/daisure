export const useTransactionService = () => {
  return {
    getTransactions: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<Transaction[]>("/transactions", {
        method: "GET",
        ...options,
      });
    },
  };
};
