export interface User {
  _id: string;
  auth: {
    email?: string;
    lineUserId?: string;
  };
  profile: {
    displayName: string;
    firstName?: string;
    lastName?: string;
    pictureUrl?: string;
    phone?: string;
    email?: string;
  };
  role: string;
  permissions: string[];
  bankAccounts: Array<{
    bank: {
      _id: string;
      name: string;
      uniqueId: string;
    };
    accountNumber: string;
    accountName: string;
    isDefault: boolean;
    isVerified: boolean;
  }>;
  rating: {
    asSeller: { average: number; total: number; count: number };
    asBuyer: { average: number; total: number; count: number };
  };
  statistics: {
    totalBought: number;
    totalSold: number;
    totalCompleted: number;
    successRate: number;
  };
  status: string;
  isBlocked: boolean;
  lastLoginAt?: string;
  lastLoginPlatform?: string;
  createdAt: string;
  updatedAt: string;
}
