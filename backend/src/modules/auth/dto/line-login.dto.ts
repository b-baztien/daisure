import { IsString } from 'class-validator';

export class LineLoginDto {
  @IsString()
  accessToken: string;
}
