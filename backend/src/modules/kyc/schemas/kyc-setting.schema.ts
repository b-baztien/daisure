import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class KycSetting extends Document {
  @Prop({ required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ required: true, default: 0 })
  minimumPrice: number; // ราคาขั้นต่ำที่ต้องทำ KYC

  @Prop({ default: true })
  isEnabled: boolean; // เปิด/ปิดการใช้งาน KYC

  @Prop()
  updatedBy?: string; // admin ที่อัพเดทล่าสุด
}

export const KycSettingSchema = SchemaFactory.createForClass(KycSetting);
