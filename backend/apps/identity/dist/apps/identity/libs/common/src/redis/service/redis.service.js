"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisHelper_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisHelper = void 0;
const redis_constant_1 = require("../constants/redis.constant");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const common_2 = require("../..");
const Redis = __importStar(require("ioredis"));
const redlock_1 = __importDefault(require("redlock"));
let RedisHelper = RedisHelper_1 = class RedisHelper {
    redis;
    redlock;
    logger = new common_1.Logger(RedisHelper_1.name);
    constructor(redis) {
        this.redis = redis;
        this.redlock = new redlock_1.default([this.redis], {
            retryCount: Number(process.env.REDLOCK_RETRY_COUNT),
            retryDelay: Number(process.env.REDLOCK_RETRY_DELAY),
            retryJitter: Number(process.env.REDLOCK_RETRY_JITTER),
        });
    }
    async get(key) {
        return this.redis.get(key);
    }
    async set(key, value, ttl) {
        if (ttl && ttl > 0) {
            await this.redis.set(key, value, 'EX', ttl);
        }
        else {
            await this.redis.set(key, value);
        }
    }
    async del(key) {
        return this.redis.del(key);
    }
    getRedisRaw() {
        return this.redis;
    }
    async withResourceLock(resourceIds, fn) {
        const resources = resourceIds.map((resourceId) => {
            return `lock:${resourceId}`;
        });
        const ttl = Number(process.env.REDLOCK_TTL);
        let lock;
        try {
            lock = await this.redlock.acquire(resources, ttl);
            this.logger.log(`Lock acquired for ${resources.join(', ')}`);
            return await fn();
        }
        catch (error) {
            if (error?.name === 'LockError' || error?.name === 'ExecutionError') {
                throw new microservices_1.RpcException(common_2.ErrorCode.RESOURCE_BUSY);
            }
            throw error;
        }
        finally {
            if (lock) {
                try {
                    await lock.release();
                    this.logger.log(`Lock released for ${resources.join(', ')}`);
                }
                catch (releaseErr) {
                    this.logger.error(`Failed to release lock for ${resources.join(', ')}: ${releaseErr.message}`);
                }
            }
        }
    }
};
exports.RedisHelper = RedisHelper;
exports.RedisHelper = RedisHelper = RedisHelper_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constant_1.IOREDIS)),
    __metadata("design:paramtypes", [Redis.Redis])
], RedisHelper);
//# sourceMappingURL=redis.service.js.map