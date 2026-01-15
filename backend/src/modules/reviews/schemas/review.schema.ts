import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class Reviewer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop()
  pictureUrl?: string;
}

@Schema({ _id: false })
class Response {
  @Prop()
  comment: string;

  @Prop()
  respondedAt: Date;
}

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Review extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Transaction', required: true })
  transactionId: Types.ObjectId;

  @Prop({ required: true })
  transactionNumber: string;

  @Prop({ type: Reviewer, required: true })
  reviewer: Reviewer;

  @Prop({ type: Reviewer, required: true })
  reviewee: Reviewer;

  @Prop({ required: true, enum: ['buyer_to_seller', 'seller_to_buyer'] })
  type: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Response })
  response?: Response;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop()
  hiddenReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  hiddenBy?: Types.ObjectId;

  @Prop()
  createdFrom: string; // 'line' | 'web'

  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes
ReviewSchema.index({ transactionId: 1 });
ReviewSchema.index({ 'reviewee.userId': 1, createdAt: -1 });
ReviewSchema.index({ 'reviewer.userId': 1 });
