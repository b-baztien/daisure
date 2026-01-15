import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  transactionId: string;

  @IsBoolean()
  isApproved: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
