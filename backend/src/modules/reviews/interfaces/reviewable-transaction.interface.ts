import { Types } from 'mongoose';

export interface ReviewableTransaction {
  transactionId: Types.ObjectId;
  transactionNumber: string;
  productName: string;
  otherParty: string;
  completedAt: Date;
}
