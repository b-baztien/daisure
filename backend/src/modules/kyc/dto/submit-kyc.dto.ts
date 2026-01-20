import { IsString, IsArray, IsNotEmpty, MinLength } from 'class-validator';

export class IdCardInfoDto {
  @IsString()
  @IsNotEmpty()
  idCardNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  dateOfBirth?: string;

  @IsString()
  address?: string;
}

export class SubmitKycDto {
  @IsArray()
  @IsNotEmpty()
  idCardImages: string[];

  @IsNotEmpty()
  idCardInfo: IdCardInfoDto;
}
