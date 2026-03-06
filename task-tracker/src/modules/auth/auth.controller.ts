import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { VerifyDto } from './dto/verify.dto';
import e from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify')
  async verify(
    @Body() dto: VerifyDto,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    return this.authService.verify(dto, res);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    return this.authService.login(dto, res);
  }
}
