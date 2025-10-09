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
exports.RepositoryService = void 0;
const common_1 = require("@nestjs/common");
const profile_repository_1 = require("./profile.repository");
const identity_repository_1 = require("./identity.repository");
const product_repository_1 = require("./product.repository");
const order_repository_1 = require("./order.repository");
const order_item_repository_1 = require("./order-item.repository");
const discount_ticket_repository_1 = require("./discount-ticket.repository");
const user_ticket_repository_1 = require("./user-ticket.repository");
const order_ticket_repository_1 = require("./order-ticket.repository");
let RepositoryService = class RepositoryService {
    identity;
    profile;
    product;
    order;
    orderItem;
    discountTicket;
    userTicket;
    orderTicket;
    constructor(identity, profile, product, order, orderItem, discountTicket, userTicket, orderTicket) {
        this.identity = identity;
        this.profile = profile;
        this.product = product;
        this.order = order;
        this.orderItem = orderItem;
        this.discountTicket = discountTicket;
        this.userTicket = userTicket;
        this.orderTicket = orderTicket;
    }
};
exports.RepositoryService = RepositoryService;
exports.RepositoryService = RepositoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [identity_repository_1.IdentityRepository,
        profile_repository_1.ProfileRepository,
        product_repository_1.ProductRepository,
        order_repository_1.OrderRepository,
        order_item_repository_1.OrderItemRepository,
        discount_ticket_repository_1.DiscountTicketRepository,
        user_ticket_repository_1.UserTicketRepository,
        order_ticket_repository_1.OrderTicketRepository])
], RepositoryService);
//# sourceMappingURL=repository.service.js.map