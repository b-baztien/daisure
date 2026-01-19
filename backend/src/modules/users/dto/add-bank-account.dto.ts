import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class BankDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  uniqueId: string;
}

export class AddBankAccountDto {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => BankDto)
  bank: BankDto;

  @IsString()
  accountNumber: string;

  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
