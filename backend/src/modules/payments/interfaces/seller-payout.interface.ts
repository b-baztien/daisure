import { TransactionStatus } from '../../../common/enums/transaction-status.enum';

export interface SellerPayoutItem {
  transactionNumber: string;
  productName: string;
  amount: number;
  paidAt: Date;
  status: TransactionStatus;
}
