import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';

export function BullMqConfig(
  configService: ConfigService,
): Promise<QueueOptions> | QueueOptions {
  return {
    connection: {
      host: configService.getOrThrow('BULL_MQ_HOST'),
      port: configService.getOrThrow('BULL_MQ_PORT'),
    },
  };
}
