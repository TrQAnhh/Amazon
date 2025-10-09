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
exports.UserTicketEntity = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("../../../../libs/common/src");
const discount_ticket_entity_1 = require("./discount-ticket.entity");
const order_ticket_entity_1 = require("./order-ticket.entity");
let UserTicketEntity = class UserTicketEntity {
    id;
    userId;
    status;
    quantity;
    ticket;
    orderTickets;
};
exports.UserTicketEntity = UserTicketEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserTicketEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserTicketEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: common_1.UserTicketStatus, default: common_1.UserTicketStatus.AVAILABLE }),
    __metadata("design:type", String)
], UserTicketEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserTicketEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => discount_ticket_entity_1.DiscountTicketEntity, (ticket) => ticket.userTickets),
    __metadata("design:type", discount_ticket_entity_1.DiscountTicketEntity)
], UserTicketEntity.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_ticket_entity_1.OrderTicketEntity, (orderTicket) => orderTicket.userTicket),
    __metadata("design:type", Array)
], UserTicketEntity.prototype, "orderTickets", void 0);
exports.UserTicketEntity = UserTicketEntity = __decorate([
    (0, typeorm_1.Entity)()
], UserTicketEntity);
//# sourceMappingURL=user-ticket.entity.js.map