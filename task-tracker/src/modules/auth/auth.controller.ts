import {
  Body,
  Controller,
  Get,
  Post,
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

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) res: e.Response,
    @Req() req: e.Request,
    @User() user: IJwtPayload,
  ) {
    const refresh = req.cookies.refresh_token;
    return this.authService.refresh(user.id, refresh, res);
  }
}
