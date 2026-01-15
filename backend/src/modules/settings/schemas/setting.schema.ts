import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ type: Object })
  escrowFee?: {
    type: string;
    percentage: number;
    minimumFee: number;
    maximumFee: number;
  };

  @Prop({ type: Object })
  autoComplete?: {
    enabled: boolean;
    days: number;
    notifyBeforeDays: number;
  };

  @Prop({ type: Object })
  rules?: {
    minimumTransactionAmount: number;
    maximumTransactionAmount: number;
    requireIdVerification: boolean;
    requireIdVerificationAbove: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
