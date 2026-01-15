import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  sourceUrl?: string;
}

class ShippingAddressDto {
  @IsString()
  recipientName: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  subDistrict: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsString()
  postalCode: string;
}

export class CreateTransactionDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsMongoId()
  sellerId: string;

  @IsMongoId()
  buyerId: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @IsOptional()
  @IsString()
  source?: string;
}
