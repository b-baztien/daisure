import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ApproveKycDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

export class RejectKycDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
