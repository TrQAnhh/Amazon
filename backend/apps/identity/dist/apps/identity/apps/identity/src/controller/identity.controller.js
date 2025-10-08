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
exports.IdentityController = void 0;
const common_1 = require("../../../../libs/common/src");
const common_2 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const get_user_identity_query_1 = require("../queries/get-user-identity/get-user-identity.query");
const cqrs_1 = require("@nestjs/cqrs");
const get_user_identities_query_1 = require("../queries/get-user-identities/get-user-identities.query");
const sign_up_command_1 = require("../commands/sign-up/sign-up.command");
const sign_in_command_1 = require("../commands/sign-in/sign-in.command");
const validate_token_query_1 = require("../queries/validate-token/validate-token.query");
const refresh_token_command_1 = require("../commands/refresh-token/refresh-token.command");
const sign_out_command_1 = require("../commands/sign-out/sign-out.command");
const verify_email_query_1 = require("../queries/verify-email/verify-email.query");
let IdentityController = class IdentityController {
    queryBus;
    commandBus;
    constructor(queryBus, commandBus) {
        this.queryBus = queryBus;
        this.commandBus = commandBus;
    }
    async signUp(signUpDto) {
        return this.commandBus.execute(new sign_up_command_1.SignUpCommand(signUpDto));
    }
    async signIn(signInDto) {
        return this.commandBus.execute(new sign_in_command_1.SignInCommand(signInDto));
    }
    async verifyEmail(payload) {
        return this.commandBus.execute(new verify_email_query_1.VerifyEmailQuery(payload.tokenId));
    }
    async signOut(user) {
        return this.commandBus.execute(new sign_out_command_1.SignOutCommand(user));
    }
    async getUserIdentity(payload) {
        return this.queryBus.execute(new get_user_identity_query_1.GetUserIdentityQuery(payload.userId));
    }
    async getUsersIdentity(payload) {
        return this.queryBus.execute(new get_user_identities_query_1.GetUserIdentitiesQuery(payload.userIds));
    }
    async validateToken(payload) {
        return this.queryBus.execute(new validate_token_query_1.ValidateTokenQuery(payload.token));
    }
    async refreshToken(payload) {
        return this.commandBus.execute(new refresh_token_command_1.RefreshTokenCommand(payload.refreshToken));
    }
};
exports.IdentityController = IdentityController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sign_up' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "signUp", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sign_in' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_1.SignInDto]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "signIn", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'verify_email' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "verifyEmail", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'sign_out' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "signOut", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_user_identity' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "getUserIdentity", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'get_users_identity' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "getUsersIdentity", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'validate_token' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "validateToken", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'refresh_token' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IdentityController.prototype, "refreshToken", null);
exports.IdentityController = IdentityController = __decorate([
    (0, common_2.Controller)(),
    __metadata("design:paramtypes", [cqrs_1.QueryBus,
        cqrs_1.CommandBus])
], IdentityController);
//# sourceMappingURL=identity.controller.js.map