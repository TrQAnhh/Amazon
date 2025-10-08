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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const identity_entity_1 = require("../identity/src/entity/identity.entity");
let IdentityRepository = class IdentityRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        return await this.repo.findOneBy({ id });
    }
    async findByIds(userIds) {
        return this.repo.find({ where: { id: (0, typeorm_2.In)(userIds) } });
    }
    async findByEmail(email) {
        return await this.repo.findOneBy({ email });
    }
    create(data) {
        return this.repo.create(data);
    }
    async update(id, data) {
        await this.repo.update(id, data);
    }
    async save(user) {
        return this.repo.save(user);
    }
};
exports.IdentityRepository = IdentityRepository;
exports.IdentityRepository = IdentityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(identity_entity_1.IdentityEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IdentityRepository);
//# sourceMappingURL=identity.repository.js.map