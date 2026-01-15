import { Types } from 'mongoose';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface IParticipant {
  userId: Types.ObjectId;
  displayName: string;
  phone: string;
  lineUserId?: string;
}

export interface IProduct {
  name: string;
  description: string;
  category?: string;
  images: string[];
  price: number;
  sourceUrl?: string;
}

export interface IPayment {
  productPrice: number;
  escrowFee: number;
  shippingFee: number;
  totalAmount: number;
  buyerPayment?: {
    method: string;
    slipImages: string[];
    paidAmount: number;
    paidAt: Date;
    submittedFrom?: string;
    verifiedBy?: Types.ObjectId;
    verifiedAt?: Date;
  };
  sellerPayment?: {
    paidAmount: number;
    paidAt: Date;
    paidBy: Types.ObjectId;
    transferSlip?: string;
  };
}

export interface ITransactionDocument {
  _id: Types.ObjectId;
  transactionNumber: string;
  product: IProduct;
  seller: IParticipant;
  buyer: IParticipant;
  admin?: IParticipant;
  payment: IPayment;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
