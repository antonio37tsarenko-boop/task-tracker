import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { VerifyDto } from './dto/verify.dto';
import e from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { User } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyDto, @Res({ passthrough: true }) res: e.Response) {
    return this.authService.verify(dto, res);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: e.Response) {
    return this.authService.login(dto, res);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @Res({ passthrough: true }) res: e.Response,
    @Req() req: e.Request,
    @User() user: IJwtPayload,
  ) {
    const refresh = req.cookies.refresh_token;
    return this.authService.refresh(user.id, refresh, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  logout(
    @User() user: IJwtPayload,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    return this.authService.logout(user.id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  changePassword(@Body() dto: ChangePasswordDto, @User() user: IJwtPayload) {
    return this.authService.changePassword(dto, user.id);
  }

  @Get('password/forgot')
  forgotPassword(@Query() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Patch('password/verify')
  verifyForReset(@Body() dto: VerifyDto) {
    return this.authService.verifyForReset(dto);
  }

  @Patch('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
