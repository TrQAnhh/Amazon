"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTokenHandler = void 0;
const validate_token_query_1 = require("./validate-token.query");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_1 = require("@nestjs/jwt");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("../../../../../libs/common/src");
let ValidateTokenHandler = class ValidateTokenHandler {
    jwtService;
    redisHelper;
    constructor(jwtService, redisHelper) {
        this.jwtService = jwtService;
        this.redisHelper = redisHelper;
    }
    async execute(query) {
        try {
            const decoded = this.jwtService.decode(query.token);
            if (!decoded) {
                throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_JWT_TOKEN);
            }
            const validatedKey = `validated:${decoded.deviceId}`;
            const cached = await this.redisHelper.get(validatedKey);
            if (cached === decoded.tokenId) {
                return {
                    valid: true,
                    userId: decoded.sub,
                    role: decoded.role,
                    tokenId: decoded.tokenId,
                    deviceId: decoded.deviceId,
                };
            }
            const blacklistKey = `access:${decoded.tokenId}`;
            const isBlacklisted = await this.redisHelper.get(blacklistKey);
            if (isBlacklisted) {
                return {
                    valid: false,
                    userId: null,
                    role: null,
                    tokenId: null,
                    deviceId: null,
                };
            }
            const verified = await this.jwtService.verify(query.token);
            const ttl = verified.exp - Math.floor(Date.now() / 1000);
            await this.redisHelper.set(validatedKey, verified.tokenId, ttl);
            return {
                valid: true,
                userId: verified.sub,
                role: verified.role,
                tokenId: verified.tokenId,
                deviceId: verified.deviceId,
            };
        }
        catch (error) {
            console.error(`[JWT ERROR] `, error);
            return {
                valid: false,
                userId: null,
                role: null,
                tokenId: null,
                deviceId: null,
            };
        }
    }
};
exports.ValidateTokenHandler = ValidateTokenHandler;
exports.ValidateTokenHandler = ValidateTokenHandler = __decorate([
    (0, cqrs_1.QueryHandler)(validate_token_query_1.ValidateTokenQuery),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        common_1.RedisHelper])
], ValidateTokenHandler);
//# sourceMappingURL=validate-token.handler.js.map