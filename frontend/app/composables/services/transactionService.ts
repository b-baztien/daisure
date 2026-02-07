export const useTransactionService = () => {
  return {
    getTransactions: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<ResponsePagination<Transaction>>("/transactions", {
        method: "GET",
        ...options,
      });
    },
    getTransaction: (
      transactionId: string,
      options: CustomFetchOptions = {},
    ) => {
      return useCustomFetch<Transaction>(`/transactions/${transactionId}`, {
        method: "GET",
        ...options,
      });
    },
    createTransaction: (options: CustomFetchOptions = {}) => {
      return useCustomFetch<Transaction>("/transactions", {
        method: "POST",
        ...options,
      });
    },
    getTransactionByShareToken: (
      shareToken: string,
      options: CustomFetchOptions = {},
    ) => {
      return useCustomFetch<Transaction>(
        `/transactions/share/${shareToken}`,
        {
          method: "GET",
          ...options,
        },
      );
    },
  };
};
