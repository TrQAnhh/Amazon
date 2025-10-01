import { Inject, Injectable, Logger } from '@nestjs/common';
import * as Redis from 'ioredis';
import { IOREDIS } from '@app/common/redis/constants/redis.constant';
import Redlock from "redlock";

@Injectable()
export class RedisHelper {
    private redlock: Redlock;
    private readonly logger = new Logger(RedisHelper.name);

    constructor(
        @Inject(IOREDIS)
        private readonly redis: Redis.Redis
    ) {
        this.redlock = new Redlock([this.redis], {
            retryCount: 30,
            retryDelay: 100,
            retryJitter: 50,
        });
    }

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

  async del(key: Redis.RedisKey): Promise<number> {
    return this.redis.del(key);
  }

  getRedisRaw(): Redis.Redis {
    return this.redis;
  }

  async withResourceLock<T>(resourceIds: string[], fn: () => Promise<T>): Promise<T> {
    const resources = resourceIds.map((resourceId) => {
        return `lock:${resourceId}`;
    });

    const ttl = 10000;

    const lock = await this.redlock.acquire(resources, ttl);
    this.logger.log(`Lock acquired for ${resources}`);

    try {
        return await fn();
    } finally {
        await lock.release();
        this.logger.log(`Lock released for ${resources}`);
    }
  }
}
