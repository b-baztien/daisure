import { defineStore } from "pinia";

interface Payment {
  transactionId: string;
  transactionNumber: string;
  amount: number;
  status: string;
  paidAt: string;
}

export const usePaymentStore = defineStore("payment", () => {
  // State
  const payments = ref<Payment[]>([]);
  const paymentInstructions = ref<any>(null);
  const isLoading = ref(false);

  // Getters
  const totalPaid = computed(() =>
    payments.value.reduce((sum, p) => sum + p.amount, 0)
  );

  const pendingPayments = computed(() =>
    payments.value.filter((p) => p.status === "pending")
  );

  // Actions
  async function fetchPaymentHistory() {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<Payment[]>("/payments/history");
      payments.value = data;
    } catch (error) {
      console.error("Fetch payment history error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPaymentInstructions(transactionId: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<any>(
        `/payments/instructions/${transactionId}`
      );
      paymentInstructions.value = data;
      return data;
    } catch (error) {
      console.error("Fetch payment instructions error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function submitPayment(payload: any) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<any>("/payments/submit", {
        method: "POST",
        body: payload,
      });
      return data;
    } catch (error) {
      console.error("Submit payment error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function cancelPayment(transactionId: string, reason: string) {
    isLoading.value = true;
    try {
      const { apiFetch } = useApi();
      const data = await apiFetch<any>(`/payments/cancel/${transactionId}`, {
        method: "POST",
        body: { reason },
      });
      return data;
    } catch (error) {
      console.error("Cancel payment error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    payments,
    paymentInstructions,
    isLoading,
    // Getters
    totalPaid,
    pendingPayments,
    // Actions
    fetchPaymentHistory,
    fetchPaymentInstructions,
    submitPayment,
    cancelPayment,
  };
});
