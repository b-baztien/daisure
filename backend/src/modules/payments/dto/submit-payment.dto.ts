import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitPaymentDto {
  @IsString()
  transactionId: string;

  @IsString()
  method: string; // 'bank_transfer', 'promptpay'

  @IsArray()
  @IsString({ each: true })
  slipImages: string[];

  @IsNumber()
  paidAmount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
