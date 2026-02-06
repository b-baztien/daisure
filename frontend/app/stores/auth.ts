import { defineStore } from "pinia";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const { apiFetch, saveTokens, clearTokens, getToken } = useApi();
  const router = useRouter();

  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const isInitialized = ref(false);

  // Getters
  const isAdmin = computed(() => user.value?.role === "admin");
  const isSeller = computed(
    () => user.value?.role === "seller" || user.value?.role === "admin",
  );
  const displayName = computed(
    () => user.value?.profile?.displayName || "User",
  );
  const avatarUrl = computed(() => user.value?.profile?.pictureUrl);

  // Actions
  async function login(payload: LoginPayload) {
    isLoading.value = true;
    try {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: payload,
      });

      // Save tokens
      saveTokens(response.access_token, response.refresh_token);

      // Save user to store
      user.value = response.user;

      // Save user to localStorage
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response.user;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(payload: RegisterPayload) {
    isLoading.value = true;
    try {
      const response = await apiFetch<LoginResponse>("/auth/register", {
        method: "POST",
        body: payload,
      });

      // Save tokens
      saveTokens(response.access_token, response.refresh_token);

      // Save user to store
      user.value = response.user;

      // Save user to localStorage
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response.user;
    } catch (error: any) {
      console.error("Register error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      // Call logout API
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Ignore logout API errors
      console.error("Logout API error:", error);
    } finally {
      // Clear tokens and user data
      clearTokens();
      user.value = null;
      isLoading.value = false;

      // Redirect to home
      if (import.meta.client) {
        router.push("/");
      }
    }
  }

  async function updateProfile(payload: Partial<User["profile"]>) {
    isLoading.value = true;
    try {
      const userData = await apiFetch<User>("/users/me", {
        method: "PATCH",
        body: { profile: payload },
      });

      user.value = userData;

      // Update localStorage
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return userData;
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function addBankAccount(payload: {
    bank: {
      _id: string;
      name: string;
      uniqueId: string;
    };
    accountNumber: string;
    accountName: string;
  }) {
    isLoading.value = true;
    try {
      const userData = await apiFetch<User>("/users/me/bank-accounts", {
        method: "POST",
        body: payload,
      });

      user.value = userData;

      // Update localStorage
      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return userData;
    } catch (error: any) {
      console.error("Add bank account error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBankAccounts() {
    isLoading.value = true;
    try {
      const accounts = await apiFetch<any[]>("/users/me/bank-accounts");
      return accounts;
    } catch (error: any) {
      console.error("Fetch bank accounts error:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Check if user needs to verify (for protected routes)
  function requireAuth() {
    if (!isAuthenticated.value) {
      if (import.meta.client) {
        router.push("/auth/login");
      }
      return false;
    }
    return true;
  }

  // Check if user is admin (for admin routes)
  function requireAdmin() {
    if (!isAdmin.value) {
      if (import.meta.client) {
        router.push("/dashboard");
      }
      return false;
    }
    return true;
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,
    // Getters
    isAdmin,
    isSeller,
    displayName,
    avatarUrl,
    // Actions
    login,
    register,
    logout,
    updateProfile,
    addBankAccount,
    fetchBankAccounts,
    requireAuth,
    requireAdmin,
  };
});
