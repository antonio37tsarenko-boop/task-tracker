import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export async function GetMailerConfig(configService: ConfigService) {
  const res: MailerOptions = {
    transport: {
      service: 'gmail',
      auth: {
        user: configService.getOrThrow('MAIL_USER'),
        pass: configService.getOrThrow('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: configService.getOrThrow('MAIL_FROM_DEFAULT'),
    },
  };
  return res;
}
