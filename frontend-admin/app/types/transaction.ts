export interface Transaction {
  _id: string;
  buyerId: string;
  sellerId: string;
  insurancePackageId: string;
  amount: number;
  escrowFee: number;
  totalAmount: number;
  status:
    | "pending_payment"
    | "payment_submitted"
    | "payment_verified"
    | "in_escrow"
    | "in_dispute"
    | "completed"
    | "cancelled"
    | "refunded";
  paymentSlipUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
