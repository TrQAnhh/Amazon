import { Module, Global, DynamicModule } from '@nestjs/common';
import Redis from 'ioredis';
import { IOREDIS, REDIS_CONFIG } from './constants/redis.constant';
import { RedisConfig } from '@app/common/redis/dto/redis-creation.dto';
import { RedisHelper } from '@app/common/redis/service/redis.service';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common/constants';
import { AppException } from '../../../../apps/api-gateway/src/exception/app.exception';

@Global()
@Module({})
export class RedisModule {
  static register(redisConfig: RedisConfig): DynamicModule {
    const redisInstance = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.accessKey,
      // tls: {},
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });
    const config = {
      provide: REDIS_CONFIG,
      useValue: redisConfig,
    };

    const ioredisProvider = {
      provide: IOREDIS,
      useValue: redisInstance,
    };

    redisInstance.on('error', (err) => {
      console.error('[REDIS ERROR]', err.message);
    });

    redisInstance.on('connect', () => {
      console.log('[REDIS] Connected');
    });

    redisInstance.on('reconnecting', () => {
      console.warn('[REDIS] Reconnecting...');
    });

    redisInstance.on('end', () => {
      console.error('[REDIS] Connection closed');
    });

    return {
      module: RedisModule,
      providers: [ioredisProvider, RedisHelper, config],
      exports: [ioredisProvider, RedisHelper, config],
      global: true,
    };
  }
}
