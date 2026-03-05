import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('Redis') private readonly redis: Redis) {}

  async get(key: string) {
    const data = await this.redis.get(key);
    if (!data) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  async set(key: string, value: string | number | object) {
    typeof value == 'object' ? (value = JSON.stringify(value)) : true;
    await this.redis.set(key, value, 'EX', 600);
  }

  async setIfNotExists(
    key: string,
    value: string | number | object,
    ttlSeconds = 600,
  ): Promise<boolean> {
    typeof value == 'object' ? (value = JSON.stringify(value)) : true;
    const result = await this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }
}
