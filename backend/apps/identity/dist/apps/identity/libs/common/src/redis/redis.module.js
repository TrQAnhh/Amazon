"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const redis_constant_1 = require("./constants/redis.constant");
const redis_service_1 = require("./service/redis.service");
let RedisModule = RedisModule_1 = class RedisModule {
    static register(redisConfig) {
        const redisInstance = new ioredis_1.default({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.accessKey,
            retryStrategy(times) {
                return Math.min(times * 50, 2000);
            },
        });
        const config = {
            provide: redis_constant_1.REDIS_CONFIG,
            useValue: redisConfig,
        };
        const ioredisProvider = {
            provide: redis_constant_1.IOREDIS,
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
            module: RedisModule_1,
            providers: [ioredisProvider, redis_service_1.RedisHelper, config],
            exports: [ioredisProvider, redis_service_1.RedisHelper, config],
            global: true,
        };
    }
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = RedisModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RedisModule);
//# sourceMappingURL=redis.module.js.map