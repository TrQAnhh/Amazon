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
exports.VerifyEmailHandler = void 0;
const verify_email_query_1 = require("./verify-email.query");
const common_1 = require("../../../../../libs/common/src");
const microservices_1 = require("@nestjs/microservices");
const repository_service_1 = require("../../../../repository/repository.service");
const cqrs_1 = require("@nestjs/cqrs");
let VerifyEmailHandler = class VerifyEmailHandler {
    redisHelper;
    repository;
    constructor(redisHelper, repository) {
        this.redisHelper = redisHelper;
        this.repository = repository;
    }
    async execute(query) {
        const { tokenId } = query;
        const userId = await this.redisHelper.get(tokenId);
        if (!userId) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_VERIFICATION_TOKEN);
        }
        await this.repository.identity.update(Number(userId), { isVerified: true });
        await this.redisHelper.del(tokenId);
        return 'Email verified successfully, please login';
    }
};
exports.VerifyEmailHandler = VerifyEmailHandler;
exports.VerifyEmailHandler = VerifyEmailHandler = __decorate([
    (0, cqrs_1.QueryHandler)(verify_email_query_1.VerifyEmailQuery),
    __metadata("design:paramtypes", [common_1.RedisHelper,
        repository_service_1.RepositoryService])
], VerifyEmailHandler);
//# sourceMappingURL=verify-email.handler.js.map