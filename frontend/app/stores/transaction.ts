import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", () => {
  // State
  const transactions = ref<Transaction[]>([]);
  const currentTransaction = ref<Transaction | null>(null);
  const isLoading = ref(false);
  const filters = ref({
    status: null as string | null,
    search: "",
  });

  // Getters
  const filteredTransactions = computed(() => {
    let result = transactions.value;

    if (filters.value.status) {
      result = result.filter((t) => t.status === filters.value.status);
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionNumber.toLowerCase().includes(search) ||
          t.product.name.toLowerCase().includes(search),
      );
    }

    return result;
  });

  const pendingTransactions = computed(() =>
    transactions.value.filter(
      (t) =>
        t.status === "pending_payment" || t.status === "payment_verification",
    ),
  );

  const completedTransactions = computed(() =>
    transactions.value.filter((t) => t.status === "completed"),
  );

  async function fetchTransaction(id: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Transaction>(`/transactions/${id}`);
      currentTransaction.value = data;
      return data;
    } catch (error) {
      console.error("Fetch transaction error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTransaction(payload: any) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Transaction>("/transactions", {
        method: "POST",
        body: payload,
      });
      transactions.value.unshift(data);
      return data;
    } catch (error) {
      console.error("Create transaction error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function confirmDelivery(id: string, note?: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Transaction>(
        `/transactions/${id}/confirm-delivery`,
        {
          method: "PATCH",
          body: { note },
        },
      );

      // Update in list
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = data;
      }

      // Update current
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = data;
      }

      return data;
    } catch (error) {
      console.error("Confirm delivery error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function createDispute(id: string, payload: any) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Transaction>(`/transactions/${id}/dispute`, {
        method: "POST",
        body: payload,
      });

      // Update in list
      const index = transactions.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        transactions.value[index] = data;
      }

      // Update current
      if (currentTransaction.value?.id === id) {
        currentTransaction.value = data;
      }

      return data;
    } catch (error) {
      console.error("Create dispute error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function setFilter(key: string, value: any) {
    filters.value[key] = value;
  }

  function resetFilters() {
    filters.value = {
      status: null,
      search: "",
    };
  }

  return {
    // State
    transactions,
    currentTransaction,
    isLoading,
    filters,
    // Getters
    filteredTransactions,
    pendingTransactions,
    completedTransactions,

    fetchTransaction,
    createTransaction,
    confirmDelivery,
    createDispute,
    setFilter,
    resetFilters,
  };
});
