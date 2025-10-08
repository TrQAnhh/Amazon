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
exports.RefreshTokenHandler = void 0;
const refresh_token_command_1 = require("./refresh-token.command");
const cqrs_1 = require("@nestjs/cqrs");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("../../../../../libs/common/src");
const microservices_1 = require("@nestjs/microservices");
const uuid_1 = require("uuid");
let RefreshTokenHandler = class RefreshTokenHandler {
    jwtService;
    redisHelper;
    constructor(jwtService, redisHelper) {
        this.jwtService = jwtService;
        this.redisHelper = redisHelper;
    }
    async execute(command) {
        const { refreshToken } = command;
        if (!refreshToken) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_INPUT_VALUE);
        }
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken);
        }
        catch (e) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_JWT_TOKEN);
        }
        const redisKey = `refresh:${payload.deviceId}`;
        const tokenId = await this.redisHelper.get(redisKey);
        if (!tokenId || tokenId !== payload.tokenId) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_JWT_TOKEN);
        }
        const newPayload = {
            sub: payload.sub,
            role: payload.role,
            tokenId: (0, uuid_1.v4)(),
            deviceId: payload.deviceId,
        };
        const accessToken = this.jwtService.sign(newPayload);
        const newRefreshToken = this.jwtService.sign(newPayload, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
        });
        await this.redisHelper.set(redisKey, newPayload.tokenId, Number(process.env.JWT_REFRESH_TOKEN_DURATION));
        return {
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        };
    }
};
exports.RefreshTokenHandler = RefreshTokenHandler;
exports.RefreshTokenHandler = RefreshTokenHandler = __decorate([
    (0, cqrs_1.CommandHandler)(refresh_token_command_1.RefreshTokenCommand),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        common_1.RedisHelper])
], RefreshTokenHandler);
//# sourceMappingURL=refresh-token.handler.js.map