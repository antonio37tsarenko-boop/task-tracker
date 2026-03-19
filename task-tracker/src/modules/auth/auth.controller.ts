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
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Public } from '../../decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: { limit: 1, ttl: 60000 },
  })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify')
  verify(@Body() dto: VerifyDto, @Res({ passthrough: true }) res: e.Response) {
    return this.authService.verify(dto, res);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: e.Response) {
    return this.authService.login(dto, res);
  }

  @Public()
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

  @Delete('logout')
  logout(
    @User() user: IJwtPayload,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    return this.authService.logout(user.id, res);
  }

  @Patch('password')
  changePassword(@Body() dto: ChangePasswordDto, @User() user: IJwtPayload) {
    return this.authService.changePassword(dto, user.id);
  }

  @Throttle({
    default: { limit: 1, ttl: 60000 },
  })
  @Public()
  @Get('password/forgot')
  forgotPassword(@Query() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Patch('password/verify')
  verifyForReset(@Body() dto: VerifyDto) {
    return this.authService.verifyForReset(dto);
  }

  @Public()
  @Patch('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Throttle({
    default: {
      ttl: 1000 * 60,
      limit: 1,
    },
  })
  @Patch('email/change/request')
  async requestEmailChange(
    @Body() dto: RequestEmailChangeDto,
    @User() user: IJwtPayload,
  ) {
    return this.authService.requestEmailChange(user.email, dto);
  }

  @Patch('email/change/verify')
  async changeEmail(
    @Body() { otp }: ChangeEmailDto,
    @User() user: IJwtPayload,
    @Res({ passthrough: true }) res: e.Response,
  ) {
    return this.authService.changeEmail(user, otp, res);
  }
}
