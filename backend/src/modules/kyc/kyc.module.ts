import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycSetting, KycSettingSchema } from './schemas/kyc-setting.schema';
import {
  KycVerification,
  KycVerificationSchema,
} from './schemas/kyc-verification.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KycSetting.name, schema: KycSettingSchema },
      { name: KycVerification.name, schema: KycVerificationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
