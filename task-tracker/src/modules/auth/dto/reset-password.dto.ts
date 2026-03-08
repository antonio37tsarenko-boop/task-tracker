import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  reset_token: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  email: string;
}
