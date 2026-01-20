import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ _id: false })
class IdCardInfo {
  @Prop({ required: true })
  idCardNumber: string; // หมายเลขบัตรประชาชน

  @Prop({ required: true })
  firstName: string; // ชื่อจริง

  @Prop({ required: true })
  lastName: string; // นามสกุล

  @Prop()
  dateOfBirth?: string; // วันเกิด

  @Prop()
  address?: string; // ที่อยู่
}

@Schema({ _id: false })
class ReviewInfo {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy?: User; // admin ที่ตรวจสอบ

  @Prop()
  reviewedAt?: Date; // วันที่ตรวจสอบ

  @Prop()
  reason?: string; // เหตุผล (กรณี rejected)

  @Prop()
  notes?: string; // หมายเหตุเพิ่มเติม
}

@Schema({ timestamps: true })
export class KycVerification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Prop({ type: [String], required: true })
  idCardImages: string[]; // URL รูปบัตรประชาชน

  @Prop({ type: IdCardInfo, required: true })
  idCardInfo: IdCardInfo;

  @Prop({ type: ReviewInfo })
  review?: ReviewInfo;

  @Prop()
  submittedAt: Date; // วันที่ส่ง KYC

  @Prop()
  approvedAt?: Date; // วันที่อนุมัติ

  @Prop()
  rejectedAt?: Date; // วันที่ปฏิเสธ
}

export const KycVerificationSchema =
  SchemaFactory.createForClass(KycVerification);

// Indexes
KycVerificationSchema.index({ userId: 1, status: 1 });
KycVerificationSchema.index({ status: 1, submittedAt: -1 });
