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
exports.ProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const profile_identity_1 = require("../profile/src/entity/profile.identity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ProfileRepository = class ProfileRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(data) {
        return this.repo.create(data);
    }
    async findAll() {
        return await this.repo.find();
    }
    async findByUserId(userId) {
        return await this.repo.findOneBy({ userId });
    }
    async updateByUserId(userId, data) {
        await this.repo.update({ userId }, data);
    }
    merge(entity, data) {
        return this.repo.merge(entity, data);
    }
    async save(profile) {
        return await this.repo.save(profile);
    }
};
exports.ProfileRepository = ProfileRepository;
exports.ProfileRepository = ProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_identity_1.ProfileEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfileRepository);
//# sourceMappingURL=profile.repository.js.map