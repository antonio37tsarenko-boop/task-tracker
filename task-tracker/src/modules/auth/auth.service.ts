import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from './dto/register.dto';
import { generateOtp } from '../../utils/generate-otp.util';
import { ResStatuses } from '../../common/enums/res-status.enum';
import {
  CACHE_DATA_DAMAGED_ERROR,
  getOtpText,
  OTP_NOT_REQUESTED_ERROR,
  OTP_SENT_ERROR,
  WRONG_OTP_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { VerifyDto } from './dto/verify.dto';
import { UsersService } from '../users/users.service';
import { IRegisterCacheData } from './interfaces/register-cache-data.interface';
import { HashService } from '../hash/hash.service';
import { USER_EXISTS_ERROR } from '../../common/constants';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { User, UserRoles } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import e from 'express';

@Injectable()
export class AuthService {
  logger: Logger = new Logger('AuthService');
  constructor(
    private readonly cacheService: CacheService,
    private readonly mailService: MailerService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register({ email, name, password }: RegisterDto) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException(USER_EXISTS_ERROR);
    }

    const otp = generateOtp();
    const hashedPassword = await this.hashService.hash(password);
    const cacheData: IRegisterCacheData = { otp, email, name, hashedPassword };
    if (
      !(await this.cacheService.setIfNotExists(
        `registration:${email.toLowerCase().trim()}`,
        cacheData,
      ))
    ) {
      throw new BadRequestException(OTP_SENT_ERROR);
    }

    this.logger.log(`Otp is saved in cache for potential user ${email}.`);

    await this.mailService.sendMail({
      to: email,
      text: getOtpText(otp),
    });

    this.logger.log(`Otp is sent for potential user ${email}.`);

    return {
      user: {
        email,
        name,
      },
      status: ResStatuses.DONE,
    };
  }

  async verify({ email, otp }: VerifyDto, res: e.Response) {
    const cacheData =
      await this.cacheService.getParseAndDelete<IRegisterCacheData>(
        `registration:${email.toLowerCase().trim()}`,
      );
    if (typeof cacheData == 'string') {
      throw new InternalServerErrorException(CACHE_DATA_DAMAGED_ERROR);
    }
    if (!cacheData) {
      throw new BadRequestException(OTP_NOT_REQUESTED_ERROR);
    }
    if (cacheData.otp !== otp) {
      throw new BadRequestException(WRONG_OTP_ERROR);
    }

    const user = await this.usersService.createOrThrow({
      email: cacheData.email,
      hashedPassword: cacheData.hashedPassword,
      name: cacheData.name,
      role: UserRoles.USER,
    });

    const payload: IJwtPayload = {
      id: user.id,
      email,
    };
    const access_token = await this.handleTokens(payload, user, res);

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
      access_token,
      status: ResStatuses.DONE,
    };
  }

  async login(data: LoginDto, res: e.Response) {
    const user = await this.usersService.findByEmailOrThrow(data.email);
    const isCorrectPassword = await this.hashService.compare(
      data.password,
      user.hashedPassword,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    const payload: IJwtPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const access_token = await this.handleTokens(payload, user, res);

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
      },
      access_token,
      status: ResStatuses.DONE,
    };
  }

  private async getTokens(payload: IJwtPayload) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refresh_token = await this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    return {
      access_token,
      refresh_token,
    };
  }

  private async handleTokens(
    payload: IJwtPayload,
    user: User,
    res: e.Response,
  ) {
    const { access_token, refresh_token } = await this.getTokens(payload);
    await this.cacheService.set(
      `refresh:${user.id}`,
      await this.hashService.hash(refresh_token),
      7 * 24 * 60 * 60,
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return access_token;
  }

  async refresh(userId: string, refresh: string, res: e.Response) {
    const correctRefresh = await this.cacheService.get(`refresh:${userId}`);
    if (!correctRefresh) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findByIdOrThrow(userId);

    const isCorrectRefresh = await this.hashService.compare(
      refresh,
      correctRefresh,
    );
    if (!isCorrectRefresh) {
      throw new UnauthorizedException();
    }
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.handleTokens(payload, user, res);

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
      },
      access_token,
      status: ResStatuses.DONE,
    };
  }

  async logout(userId: string, res: e.Response) {
    await this.cacheService.delete(`refresh:${userId}`);
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'strict',
    });

    return {
      status: ResStatuses.DONE,
    };
  }
}
