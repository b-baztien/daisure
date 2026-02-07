export interface Transaction {
  _id: string;
  transactionNumber: string;
  product: Product;
  seller: Seller;
  buyer?: Buyer;
  payment: Payment;
  status: string;
  timeline: Timeline[];
  metadata: Metadata;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Metadata {
  createdFrom: string;
  source: string;
}

interface Timeline {
  status: string;
  action: string;
  description: string;
  actorId: string;
  platform: string;
  timestamp: string;
}

interface Payment {
  productPrice: number;
  escrowFee: number;
  shippingFee: number;
  totalAmount: number;
}

interface Seller {
  userId: UserId;
  displayName: string;
  phone?: string;
  lineUserId: string;
}

interface Buyer {
  userId: UserId;
  displayName: string;
  lineUserId: string;
}

interface UserId {
  kycStatus: string;
  _id: string;
  auth: Auth;
  profile: Profile;
  role: string;
  permissions: any[];
  status: string;
  isBlocked: boolean;
  bankAccounts: BankAccount[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLoginAt: string;
  lastLoginPlatform: string;
}

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface Profile {
  displayName: string;
  pictureUrl: string;
}

interface Auth {
  lineUserId: string;
  refreshToken: string;
}

interface Product {
  name: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  sourceUrl: string;
}
