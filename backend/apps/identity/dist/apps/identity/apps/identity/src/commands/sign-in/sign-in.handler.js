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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInHandler = void 0;
const common_1 = require("../../../../../libs/common/src");
const cqrs_1 = require("@nestjs/cqrs");
const sign_in_command_1 = require("./sign-in.command");
const jwt_1 = require("@nestjs/jwt");
const microservices_1 = require("@nestjs/microservices");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const repository_service_1 = require("../../../../repository/repository.service");
let SignInHandler = class SignInHandler {
    repository;
    jwtService;
    redisHelper;
    constructor(repository, jwtService, redisHelper) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.redisHelper = redisHelper;
    }
    async execute(command) {
        const { signInDto } = command;
        const userByEmail = await this.repository.identity.findByEmail(signInDto.email);
        if (!userByEmail) {
            throw new microservices_1.RpcException(common_1.ErrorCode.USER_NOT_FOUND);
        }
        if (!userByEmail.isVerified) {
            throw new microservices_1.RpcException(common_1.ErrorCode.EMAIL_NOT_VERIFIED);
        }
        const success = await bcrypt.compare(signInDto.password, userByEmail.password);
        if (!success) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_CREDENTIALS);
        }
        const payload = {
            sub: userByEmail.id,
            role: userByEmail.role,
            tokenId: (0, uuid_1.v4)(),
            deviceId: signInDto.deviceId,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
        });
        const redisKey = `refresh:${signInDto.deviceId}`;
        await this.redisHelper.set(redisKey, payload.tokenId, Number(process.env.JWT_REFRESH_TOKEN_DURATION));
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
};
exports.SignInHandler = SignInHandler;
exports.SignInHandler = SignInHandler = __decorate([
    (0, cqrs_1.CommandHandler)(sign_in_command_1.SignInCommand),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService,
        jwt_1.JwtService,
        common_1.RedisHelper])
], SignInHandler);
//# sourceMappingURL=sign-in.handler.js.map