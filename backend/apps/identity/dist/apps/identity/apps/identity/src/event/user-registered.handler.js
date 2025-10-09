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
exports.UserRegisteredHandler = void 0;
const user_registered_event_1 = require("./user-registered.event");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("../../../../libs/common/src");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const microservices_1 = require("@nestjs/microservices");
let UserRegisteredHandler = class UserRegisteredHandler {
    jwtService;
    redisHelper;
    emailService;
    constructor(jwtService, redisHelper, emailService) {
        this.jwtService = jwtService;
        this.redisHelper = redisHelper;
        this.emailService = emailService;
    }
    async handle(event) {
        const { userId, email } = event;
        const tokenId = (0, uuid_1.v4)();
        await this.redisHelper.set(`${tokenId}`, userId, Number(process.env.VERIFY_EMAIL_TOKEN_DURATION));
        try {
            await this.emailService.sendEmail(email, tokenId);
        }
        catch (error) {
            console.error('Failed to send verification email:', error);
            throw new microservices_1.RpcException(common_1.ErrorCode.EMAIL_SEND_FAILED);
        }
    }
};
exports.UserRegisteredHandler = UserRegisteredHandler;
exports.UserRegisteredHandler = UserRegisteredHandler = __decorate([
    (0, cqrs_1.EventsHandler)(user_registered_event_1.UserRegisteredEvent),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        common_1.RedisHelper,
        common_1.EmailService])
], UserRegisteredHandler);
//# sourceMappingURL=user-registered.handler.js.map