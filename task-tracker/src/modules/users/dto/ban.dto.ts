import { IsInt, IsOptional } from 'class-validator';

export class BanDto {
  @IsOptional()
  @IsInt()
  minutes: number;
  @IsOptional()
  @IsInt()
  hours: number;
  @IsOptional()
  @IsInt()
  days: number;
  @IsOptional()
  @IsInt()
  months: number;
  @IsOptional()
  @IsInt()
  years: number;
}
