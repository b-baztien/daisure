import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionStatus } from '../../../common/enums/transaction-status.enum';

@Schema({ _id: false })
class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  price: number;

  @Prop()
  sourceUrl?: string;
}

@Schema({ _id: false })
class Participant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  displayName: string;

  @Prop()
  phone: string;

  @Prop()
  lineUserId?: string;
}

@Schema({ _id: false })
class Payment {
  @Prop({ required: true })
  productPrice: number;

  @Prop({ default: 0 })
  escrowFee: number;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: Object })
  buyerPayment?: {
    method: string;
    slipImages: string[];
    paidAmount: number;
    paidAt: Date;
    submittedFrom?: string;
    verifiedBy?: Types.ObjectId;
    verifiedAt?: Date;
  };

  @Prop({ type: Object })
  sellerPayment?: {
    paidAmount: number;
    paidAt: Date;
    paidBy: Types.ObjectId;
    transferSlip?: string;
  };
}

@Schema({ _id: false })
class Timeline {
  @Prop({ required: true })
  status: string;

  @Prop()
  action: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  actorId: Types.ObjectId;

  @Prop()
  platform: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true, unique: true })
  transactionNumber: string;

  @Prop({ type: Product, required: true })
  product: Product;

  @Prop({ type: Participant, required: true })
  seller: Participant;

  @Prop({ type: Participant })
  buyer?: Participant;

  @Prop({ type: Participant })
  admin?: Participant;

  @Prop({ type: Payment, required: true })
  payment: Payment;

  @Prop({ type: Object })
  shipping?: {
    method: string;
    trackingNumber?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };

  @Prop({
    type: String,
    enum: Object.values(TransactionStatus),
    default: TransactionStatus.INITIATED,
  })
  status: TransactionStatus;

  @Prop({ type: [Timeline], default: [] })
  timeline: Timeline[];

  @Prop({ type: Object })
  dispute?: {
    isDisputed: boolean;
    initiatedBy: string;
    initiatedAt?: Date;
    reason: string;
    reasonCategory?: string;
    description: string;
    evidence: Array<{
      type: string;
      url: string;
      description?: string;
      uploadedAt: Date;
    }>;
    resolution?: {
      decision: string;
      explanation: string;
      resolvedBy: Types.ObjectId;
      resolvedAt: Date;
      refundAmount?: number;
    };
  };

  @Prop({ type: Object })
  metadata?: {
    createdFrom: string;
    source: string;
  };

  @Prop({ unique: true, sparse: true })
  shareToken?: string;

  @Prop()
  autoCompleteAt?: Date;

  @Prop()
  completedAt?: Date;

  // Timestamps from Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes
TransactionSchema.index({ transactionNumber: 1 });
TransactionSchema.index({ 'buyer.userId': 1, status: 1 });
TransactionSchema.index({ 'seller.userId': 1, status: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ shareToken: 1 });
