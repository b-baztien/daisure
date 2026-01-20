import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  DashboardStats,
  Transaction,
  VerifyPaymentRequest,
  DisputeResolution,
  User,
  Review,
  AdminLog,
  Settings,
  UpdateEscrowFeeRequest,
  KycSetting,
  UpdateKycSettingRequest,
  KycVerification,
  ApproveKycRequest,
  RejectKycRequest,
  PaginationQuery,
  PaginatedResponse
} from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  // Create axios instance
  const api: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = authStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Handle 401 and 403 responses
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authStore.logout()
        navigateTo('/login')
      } else if (error.response?.status === 403) {
        // Forbidden - user doesn't have admin access
        console.error('Access forbidden - admin privileges required')
        authStore.logout()
        navigateTo('/login')
      }
      return Promise.reject(error)
    }
  )

  return {
    // Auth
    login: (data: LoginRequest) =>
      api.post<LoginResponse>('/auth/login', data),

    getCurrentUser: () =>
      api.get<User>('/users/me'),

    // Dashboard
    getDashboardStats: () =>
      api.get<DashboardStats>('/admin/dashboard'),

    // Transactions
    getTransactions: (params?: Record<string, any>) =>
      api.get<Transaction[] | PaginatedResponse<Transaction>>('/transactions', { params }),

    verifyPayment: (id: string, data: VerifyPaymentRequest) =>
      api.post<Transaction>(`/admin/transactions/${id}/verify-payment`, data),

    resolveDispute: (id: string, data: DisputeResolution) =>
      api.post<Transaction>(`/admin/transactions/${id}/resolve-dispute`, data),

    // Users
    getUsers: (params?: Record<string, any>) =>
      api.get<User[] | PaginatedResponse<User>>('/users', { params }),

    getUserById: (id: string) =>
      api.get<User>(`/users/${id}`),

    // Reviews
    getReviews: (params?: Record<string, any>) =>
      api.get<Review[] | PaginatedResponse<Review>>('/reviews', { params }),

    hideReview: (id: string, reason: string) =>
      api.patch<Review>(`/reviews/${id}/hide`, { reason }),

    unhideReview: (id: string) =>
      api.patch<Review>(`/reviews/${id}/unhide`),

    // Settings
    getSettings: () =>
      api.get<Settings>('/settings'),

    updateEscrowFee: (data: UpdateEscrowFeeRequest) =>
      api.patch<Settings>('/settings/escrow-fee', data),

    // Admin Logs
    getAdminLogs: (params?: Record<string, any>) =>
      api.get<AdminLog[] | PaginatedResponse<AdminLog>>('/admin/logs', { params }),

    // KYC
    getKycSettings: () =>
      api.get<KycSetting>('/kyc/settings'),

    updateKycSettings: (data: UpdateKycSettingRequest) =>
      api.put<KycSetting>('/kyc/settings', data),

    getKycVerifications: (params?: Record<string, any>) =>
      api.get<KycVerification[] | PaginatedResponse<KycVerification>>('/kyc/verifications', { params }),

    approveKyc: (id: string, data: ApproveKycRequest) =>
      api.put<KycVerification>(`/kyc/verifications/${id}/approve`, data),

    rejectKyc: (id: string, data: RejectKycRequest) =>
      api.put<KycVerification>(`/kyc/verifications/${id}/reject`, data),

    // Generic request method for custom calls
    request: <T>(config: AxiosRequestConfig) =>
      api.request<T>(config)
  }
}
