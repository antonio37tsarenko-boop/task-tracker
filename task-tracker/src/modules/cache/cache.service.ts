import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('Redis') private readonly redis: Redis) {}

  async getAndParse<T>(key: string): Promise<string | null | T> {
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

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
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

  delete(key: string): boolean {
    return Boolean(this.redis.del(key));
  }

  async getAndDelete(key: string) {
    return this.redis.getdel(key);
  }

  async getParseAndDelete<T>(key: string): Promise<string | null | T> {
    const data = await this.redis.getdel(key);
    if (!data) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
}
