import type { FormErrorEvent } from "@nuxt/ui";
import parseJson from "~/utils/paresJson";

export const useAlert = (errorData?: any | FormErrorEvent) => {
  const nuxtApp = useNuxtApp();

  const { t } = nuxtApp.$i18n;

  const toast = useToast();

  const duration = 5000;

  const success = (message: string) => {
    toast.add({
      title: t("alert_status.success"),
      description: message,
      color: "success",
      icon: "i-solar-check-circle-linear",
      duration,
    });
  };

  const error = (message: string) => {
    toast.add({
      title: t("alert_status.error"),
      color: "error",
      icon: "i-material-symbols-error-circle-rounded",
      description: message,
      duration,
    });
  };

  const clear = () => {
    toast.clear();
  };

  if (errorData) {
    let errorMessage =
      (errorData as any)?.data?.message ||
      (errorData as FormErrorEvent)?.errors?.map(
        (error) => `${error.name}: ${error.message}`
      ) ||
      t("alert_status.error_occurred");

    try {
      errorMessage = parseJson((errorData as any)?.data?.message);

      if (errorMessage?.error?.message?.message) {
        errorMessage = errorMessage.error.message.message;
      }
    } catch {
      // do nothing
    }

    if (Array.isArray(errorMessage)) {
      for (const message of errorMessage) {
        error(message);
      }
    } else {
      error(errorMessage);
    }
  }

  return {
    success,
    error,
    clear,
  };
};

