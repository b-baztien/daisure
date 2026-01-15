import { TransactionStatus } from '../../../common/enums/transaction-status.enum';
import { ITransactionDocument } from '../../../common/interfaces/transaction.interface';

export interface PaymentDetails {
  transactionNumber: string;
  payment: ITransactionDocument['payment'];
  status: TransactionStatus;
}
