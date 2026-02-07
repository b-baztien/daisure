import { Type } from 'class-transformer';
import {
  IsArray,
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

export class CreateTransactionDto {
  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @IsOptional()
  @IsString()
  source?: string;
}
