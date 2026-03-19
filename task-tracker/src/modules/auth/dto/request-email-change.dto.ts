import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail()
  newEmail: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
