import { IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateKycSettingDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumPrice?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
