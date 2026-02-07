import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type {
  AdminLog,
  ApproveKycRequest,
  DisputeResolution,
  KycSetting,
  KycVerification,
  LoginRequest,
  LoginResponse,
  PaginatedResponse,
  RejectKycRequest,
  Review,
  Settings,
  Transaction,
  UpdateEscrowFeeRequest,
  UpdateKycSettingRequest,
  User,
  VerifyPaymentRequest,
} from "~/types/api";

export const useApi = () => {
  const config = useRuntimeConfig();

  // Create axios instance
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    // Auth
    login: (data: LoginRequest) => api.post<LoginResponse>("/auth/login", data),

    getCurrentUser: () => api.get<User>("/users/me"),

    verifyPayment: (id: string, data: VerifyPaymentRequest) =>
      api.post<Transaction>(`/admin/transactions/${id}/verify-payment`, data),

    resolveDispute: (id: string, data: DisputeResolution) =>
      api.post<Transaction>(`/admin/transactions/${id}/resolve-dispute`, data),

    getUserById: (id: string) => api.get<User>(`/users/${id}`),

    // Reviews
    getReviews: (params?: Record<string, any>) =>
      api.get<Review[] | PaginatedResponse<Review>>("/reviews", { params }),

    hideReview: (id: string, reason: string) =>
      api.patch<Review>(`/reviews/${id}/hide`, { reason }),

    unhideReview: (id: string) => api.patch<Review>(`/reviews/${id}/unhide`),

    // Settings
    getSettings: () => api.get<Settings>("/settings"),

    updateEscrowFee: (data: UpdateEscrowFeeRequest) =>
      api.patch<Settings>("/settings/escrow-fee", data),

    // Admin Logs
    getAdminLogs: (params?: Record<string, any>) =>
      api.get<AdminLog[] | PaginatedResponse<AdminLog>>("/admin/logs", {
        params,
      }),

    // KYC
    getKycSettings: () => api.get<KycSetting>("/kyc/settings"),

    updateKycSettings: (data: UpdateKycSettingRequest) =>
      api.put<KycSetting>("/kyc/settings", data),

    getKycVerifications: (params?: Record<string, any>) =>
      api.get<KycVerification[] | PaginatedResponse<KycVerification>>(
        "/kyc/verifications",
        { params },
      ),

    approveKyc: (id: string, data: ApproveKycRequest) =>
      api.put<KycVerification>(`/kyc/verifications/${id}/approve`, data),

    rejectKyc: (id: string, data: RejectKycRequest) =>
      api.put<KycVerification>(`/kyc/verifications/${id}/reject`, data),

    // Generic request method for custom calls
    request: <T>(config: AxiosRequestConfig) => api.request<T>(config),
  };
};
