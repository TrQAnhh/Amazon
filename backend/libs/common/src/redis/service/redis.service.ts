import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { IOREDIS } from '@app/common/redis/constants/redis.constant';

@Injectable()
export class RedisHelper {
  constructor(
    @Inject(IOREDIS)
    private readonly redis: Redis.Redis,
  ) {}

  async get(key: Redis.RedisKey): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: Redis.RedisKey, value: any, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async sadd(key: Redis.RedisKey, value: any, ttl?: number): Promise<void> {
    await this.redis.sadd(key, value);
    if (ttl && ttl > 0) {
        await this.redis.expire(key, ttl);
    }
  }

  async sismember(key: Redis.RedisKey, value: any): Promise<boolean> {
    const result = await this.redis.sismember(key, value);
    return result === 1;
  }

  async del(key: Redis.RedisKey): Promise<number> {
    return this.redis.del(key);
  }

  getRedisRaw(): Redis.Redis {
    return this.redis;
  }
}
