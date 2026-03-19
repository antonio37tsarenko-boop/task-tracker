import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SentMessageInfo } from 'nodemailer';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  process(
    job: Job<ISendMailOptions>,
    token?: string,
  ): Promise<SentMessageInfo> {
    return this.mailerService.sendMail(job.data);
  }
}
