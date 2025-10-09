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
exports.OrderRepository = void 0;
const order_status_enum_1 = require("../../libs/common/src/constants/order-status.enum");
const order_entity_1 = require("../order/src/entity/order.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let OrderRepository = class OrderRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    create(partial) {
        return this.repo.create(partial);
    }
    async save(order) {
        return this.repo.save(order);
    }
    async findAllByUserId(userId) {
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['items'],
        });
    }
    async findBySessionId(sessionId) {
        return this.repo.findOne({
            where: { sessionId },
            relations: ['items'],
        });
    }
    async update(id, partial) {
        return this.repo.update(id, partial);
    }
    async updateBySessionId(sessionId, partial) {
        return this.repo.update({ sessionId, status: (0, typeorm_1.Not)(order_status_enum_1.OrderStatus.PAID) }, partial);
    }
};
exports.OrderRepository = OrderRepository;
exports.OrderRepository = OrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(order_entity_1.OrderEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], OrderRepository);
//# sourceMappingURL=order.repository.js.map