// API Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin' | 'super_admin'
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalTransactions: number
  pendingVerification: number
  disputedTransactions: number
  completedToday: number
  totalVolume: number
}

export interface Transaction {
  _id: string
  buyerId: string
  sellerId: string
  insurancePackageId: string
  amount: number
  escrowFee: number
  totalAmount: number
  status: 'pending_payment' | 'payment_submitted' | 'payment_verified' | 'in_escrow' | 'in_dispute' | 'completed' | 'cancelled' | 'refunded'
  paymentSlipUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface VerifyPaymentRequest {
  isApproved: boolean
  note?: string
}

export interface DisputeResolution {
  decision: 'refund_buyer' | 'release_to_seller' | 'partial_refund'
  explanation: string
  refundAmount?: number
}

export interface Review {
  _id: string
  transactionId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  isHidden: boolean
  hiddenReason?: string
  createdAt: string
  updatedAt: string
}

export interface AdminLog {
  _id: string
  adminId: string
  action: string
  targetType: string
  targetId: string
  changes: any
  reason?: string
  ipAddress?: string
  createdAt: string
}

export interface Settings {
  escrowFeePercentage: number
}

export interface UpdateEscrowFeeRequest {
  percentage: number
}

// KYC Types
export interface KycSetting {
  _id: string
  key: string
  minimumPrice: number
  isEnabled: boolean
  updatedBy?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateKycSettingRequest {
  minimumPrice?: number
  isEnabled?: boolean
}

export interface IdCardInfo {
  idCardNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  address?: string
}

export interface ReviewInfo {
  reviewedBy?: {
    _id: string
    profile: {
      displayName: string
    }
  }
  reviewedAt?: string
  reason?: string
  notes?: string
}

export interface KycVerification {
  _id: string
  userId: {
    _id: string
    profile: {
      displayName: string
      email?: string
    }
    auth: {
      email?: string
    }
    bankAccounts?: Array<{
      bank: any
      accountNumber: string
      accountName: string
      isDefault: boolean
    }>
  }
  status: 'pending' | 'approved' | 'rejected'
  idCardImages: string[]
  idCardInfo: IdCardInfo
  review?: ReviewInfo
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ApproveKycRequest {
  notes?: string
}

export interface RejectKycRequest {
  reason: string
  notes?: string
}
