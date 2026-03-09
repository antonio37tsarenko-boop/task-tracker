import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  // ThrottlerStorageKeyv,
} from '@nestjs/throttler';
// import Keyv from 'keyv';
// import KeyvRedis from '@keyv/redis';

export const getThrottlerConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => ({
  throttlers: [
    {
      ttl: 60000,
      limit: configService.getOrThrow('THROTTLER_LIMIT'),
    },
  ],
  // storage: new ThrottlerStorageKeyv(
  //   new Keyv({
  //     store: new KeyvRedis(
  //       `redis://${configService.getOrThrow('REDIS_HOST')}:${configService.getOrThrow('REDIS_PORT')}`,
  //     ),
  //   }),
  // ),
});
