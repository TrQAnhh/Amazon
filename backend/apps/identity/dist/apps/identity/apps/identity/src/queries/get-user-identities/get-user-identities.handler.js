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
exports.GetUserIdentitiesHandler = void 0;
const common_1 = require("../../../../../libs/common/src");
const cqrs_1 = require("@nestjs/cqrs");
const get_user_identities_query_1 = require("./get-user-identities.query");
const microservices_1 = require("@nestjs/microservices");
const repository_service_1 = require("../../../../repository/repository.service");
let GetUserIdentitiesHandler = class GetUserIdentitiesHandler {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(query) {
        if (!query.userIds || query.userIds.length === 0) {
            throw new microservices_1.RpcException(common_1.ErrorCode.INVALID_INPUT_VALUE);
        }
        const users = await this.repository.identity.findByIds(query.userIds);
        const result = {};
        users.forEach((user) => (result[user.id] = { email: user.email }));
        return result;
    }
};
exports.GetUserIdentitiesHandler = GetUserIdentitiesHandler;
exports.GetUserIdentitiesHandler = GetUserIdentitiesHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_user_identities_query_1.GetUserIdentitiesQuery),
    __metadata("design:paramtypes", [repository_service_1.RepositoryService])
], GetUserIdentitiesHandler);
//# sourceMappingURL=get-user-identities.handler.js.map