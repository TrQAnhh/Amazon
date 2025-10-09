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
exports.SignOutHandler = void 0;
const sign_out_command_1 = require("./sign-out.command");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("../../../../../libs/common/src");
let SignOutHandler = class SignOutHandler {
    redisHelper;
    constructor(redisHelper) {
        this.redisHelper = redisHelper;
    }
    async execute(command) {
        const { user } = command;
        const redisKey = `access:${user.tokenId}`;
        const now = Math.floor(Date.now() / 1000);
        const ttl = user.exp - now;
        await this.redisHelper.set(redisKey, '1', ttl);
        await this.redisHelper.del(`refresh:${user.deviceId}`);
        await this.redisHelper.del(`validated:${user.deviceId}`);
        return 'Sign out successfully';
    }
};
exports.SignOutHandler = SignOutHandler;
exports.SignOutHandler = SignOutHandler = __decorate([
    (0, cqrs_1.CommandHandler)(sign_out_command_1.SignOutCommand),
    __metadata("design:paramtypes", [common_1.RedisHelper])
], SignOutHandler);
//# sourceMappingURL=sign-out.handler.js.map