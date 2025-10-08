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
exports.DiscountTicketEntity = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("../../../../libs/common/src");
const user_ticket_entity_1 = require("./user-ticket.entity");
let DiscountTicketEntity = class DiscountTicketEntity {
    id;
    code;
    type;
    value;
    minOrderAmount;
    maxDiscount;
    startDate;
    endDate;
    total;
    usageLimit;
    status;
    userTickets;
};
exports.DiscountTicketEntity = DiscountTicketEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], DiscountTicketEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: common_1.DiscountType }),
    __metadata("design:type", String)
], DiscountTicketEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "maxDiscount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DiscountTicketEntity.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DiscountTicketEntity.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DiscountTicketEntity.prototype, "usageLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: common_1.DiscountStatus, default: common_1.DiscountStatus.ACTIVE }),
    __metadata("design:type", String)
], DiscountTicketEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_ticket_entity_1.UserTicketEntity, (userTicket) => userTicket.ticket),
    __metadata("design:type", Array)
], DiscountTicketEntity.prototype, "userTickets", void 0);
exports.DiscountTicketEntity = DiscountTicketEntity = __decorate([
    (0, typeorm_1.Entity)()
], DiscountTicketEntity);
//# sourceMappingURL=discount-ticket.entity.js.map