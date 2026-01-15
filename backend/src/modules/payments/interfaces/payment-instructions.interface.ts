export interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  promptPayId?: string;
  qrCodeUrl?: string;
}

export interface PaymentInstructions {
  transactionNumber: string;
  totalAmount: number;
  breakdown: {
    productPrice: number;
    escrowFee: number;
    shippingFee: number;
  };
  bankAccounts: BankAccount[];
  instructions: string[];
  note: string;
}
