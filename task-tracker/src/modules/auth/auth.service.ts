import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
} from './auth.constants';
import { VerifyDto } from './dto/verify.dto';
import { UsersService } from '../users/users.service';
import { IRegisterCacheData } from './interfaces/register-cache-data.interface';
import { HashService } from '../hash/hash.service';
import { USER_EXISTS_ERROR } from '../../common/constants';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  logger: Logger = new Logger('AuthService');
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailerService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ email, name, password }: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
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

    this.logger.log(`Otp is saved in cache for user ${email}.`);

    await this.mailService.sendMail({
      to: email,
      text: getOtpText(otp),
    });

    this.logger.log(`Otp is sent for user ${email}.`);

    return {
      user: {
        email,
        name,
      },
      status: ResStatuses.DONE,
    };
  }

  async verify({ email, otp }: VerifyDto) {
    console.log('________DEV________-');
    await this.jwtService.signAsync({ email });
    console.log('________DEV________-');
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

    const { id } = await this.usersService.createOrThrow({
      email: cacheData.email,
      hashedPassword: cacheData.hashedPassword,
      name: cacheData.name,
    });

    const payload: IJwtPayload = {
      id,
      email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login() {}
}
