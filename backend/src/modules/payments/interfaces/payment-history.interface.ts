import { TransactionStatus } from '../../../common/enums/transaction-status.enum';

export interface PaymentHistoryItem {
  transactionNumber: string;
  productName: string;
  amount: number;
  paidAt: Date;
  status: TransactionStatus;
  verifiedAt?: Date;
}
