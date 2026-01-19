import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Bank } from '../../banks/schemas/bank.schema';

@Schema({ _id: false })
class Auth {
  @Prop()
  email?: string;

  @Prop()
  passwordHash?: string;

  @Prop()
  salt?: string;

  @Prop({ unique: true, sparse: true })
  lineUserId?: string;

  @Prop()
  facebookId?: string;

  @Prop()
  googleId?: string;

  @Prop()
  refreshToken?: string;
}

@Schema({ _id: false })
class Profile {
  @Prop()
  displayName: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  pictureUrl?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;
}

@Schema({ _id: false })
class BankAccount {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bank', required: true })
  bank: Bank;

  @Prop()
  accountNumber: string;

  @Prop()
  accountName: string;

  @Prop()
  branch?: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: false })
  isVerified: boolean;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Auth })
  auth: Auth;

  @Prop({ type: Profile })
  profile: Profile;

  @Prop({ default: 'buyer' })
  role: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: [BankAccount], default: [] })
  bankAccounts: BankAccount[];

  @Prop({ type: Object, default: {} })
  rating: {
    asSeller: { average: number; total: number; count: number };
    asBuyer: { average: number; total: number; count: number };
  };

  @Prop({ type: Object, default: {} })
  statistics: {
    totalBought: number;
    totalSold: number;
    totalCompleted: number;
    successRate: number;
  };

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  lastLoginPlatform?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ 'auth.lineUserId': 1 });
UserSchema.index({ 'auth.email': 1 });
UserSchema.index({ 'profile.phone': 1 });
