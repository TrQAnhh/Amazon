import { IOREDIS } from '@app/common/redis/constants/redis.constant';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';
import * as Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisHelper {
  private redlock: Redlock;
  private readonly logger = new Logger(RedisHelper.name);

  constructor(
    @Inject(IOREDIS)
    private readonly redis: Redis.Redis,
  ) {
    this.redlock = new Redlock([this.redis], {
      retryCount: Number(process.env.REDLOCK_RETRY_COUNT),
      retryDelay: Number(process.env.REDLOCK_RETRY_DELAY),
      retryJitter: Number(process.env.REDLOCK_RETRY_JITTER),
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

    const ttl = Number(process.env.REDLOCK_TTL);
    let lock;

    try {
      lock = await this.redlock.acquire(resources, ttl);
      this.logger.log(`Lock acquired for ${resources.join(', ')}`);
      return await fn();
    } catch (error) {
      if (error?.name === 'LockError' || error?.name === 'ExecutionError') {
        throw new RpcException(ErrorCode.RESOURCE_BUSY);
      }
      throw error;
    } finally {
      if (lock) {
        try {
          await lock.release();
          this.logger.log(`Lock released for ${resources.join(', ')}`);
        } catch (releaseErr) {
          this.logger.error(`Failed to release lock for ${resources.join(', ')}: ${releaseErr.message}`);
        }
      }
    }
  }
}
