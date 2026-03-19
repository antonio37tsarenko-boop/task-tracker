import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailProcessor } from './mail.processor';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  controllers: [MailController],
  providers: [MailProcessor, MailService],
  imports: [
    MailerModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
