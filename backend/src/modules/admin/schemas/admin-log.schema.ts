import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AdminLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @Prop({ required: true })
  adminName: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  targetType: string;

  @Prop({ type: Types.ObjectId })
  targetId: Types.ObjectId;

  @Prop({ type: Object })
  changes?: {
    before: any;
    after: any;
  };

  @Prop()
  reason?: string;

  @Prop()
  ipAddress?: string;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
