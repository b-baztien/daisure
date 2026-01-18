import { IsString } from 'class-validator';

export class LineLoginDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}
