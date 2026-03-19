import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}
  async sendMail(options: ISendMailOptions) {
    await this.mailQueue.add('mail', options);
  }
}
