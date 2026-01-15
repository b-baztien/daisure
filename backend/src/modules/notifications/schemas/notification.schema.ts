import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Transaction' })
  transactionId?: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  data?: any;

  @Prop({ type: Object, default: {} })
  channels: {
    line?: { sent: boolean; sentAt?: Date };
    email?: { sent: boolean; sentAt?: Date };
    web?: { isRead: boolean; readAt?: Date };
  };

  @Prop({ default: 'normal' })
  priority: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
