import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  providers: [
    CacheService,
    {
      inject: [ConfigService],
      provide: 'Redis',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        });
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
