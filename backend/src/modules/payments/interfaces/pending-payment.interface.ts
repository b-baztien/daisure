import { Types } from 'mongoose';

export interface PendingPayment {
  id: Types.ObjectId;
  transactionNumber: string;
  productName: string;
  totalAmount: number;
  createdAt: Date;
  daysRemaining: number;
}
