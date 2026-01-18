import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankDocument = Bank & Document;

@Schema({ timestamps: true })
export class Bank {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  uniqueId: string;

  @Prop({ default: true })
  isEnable: boolean;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
