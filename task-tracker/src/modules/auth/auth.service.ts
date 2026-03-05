import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from './dto/register.dto';
import { generateOtp } from '../../utils/generate-otp.util';
import { ResStatuses } from '../../common/enums/res-status.enum';
import {
  getOtpText,
  OTP_SENT_ERROR,
  USER_EXISTS_ERROR,
} from './auth.constants';

@Injectable()
export class AuthService {
  logger: Logger = new Logger('AuthService');
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly mailService: MailerService,
  ) {}
  async register({ email, name }: RegisterDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new BadRequestException(USER_EXISTS_ERROR);
    }

    const otp = generateOtp();
    if (
      !(await this.cacheService.setIfNotExists(
        `otp:${email.toLowerCase().trim()}`,
        otp,
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

  async verify() {}

  async login() {}
}
