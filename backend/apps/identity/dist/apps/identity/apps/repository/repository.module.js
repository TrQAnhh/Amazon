"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const identity_entity_1 = require("../identity/src/entity/identity.entity");
const product_entity_1 = require("../product/src/entity/product.entity");
const profile_identity_1 = require("../profile/src/entity/profile.identity");
const identity_repository_1 = require("./identity.repository");
const profile_repository_1 = require("./profile.repository");
const repository_service_1 = require("./repository.service");
const product_repository_1 = require("./product.repository");
const order_entity_1 = require("../order/src/entity/order.entity");
const order_items_entity_1 = require("../order/src/entity/order-items.entity");
const order_item_repository_1 = require("./order-item.repository");
const order_repository_1 = require("./order.repository");
const discount_ticket_entity_1 = require("../order/src/entity/discount-ticket.entity");
const user_ticket_entity_1 = require("../order/src/entity/user-ticket.entity");
const discount_ticket_repository_1 = require("./discount-ticket.repository");
const user_ticket_repository_1 = require("./user-ticket.repository");
const order_ticket_repository_1 = require("./order-ticket.repository");
const order_ticket_entity_1 = require("../order/src/entity/order-ticket.entity");
let RepositoryModule = class RepositoryModule {
};
exports.RepositoryModule = RepositoryModule;
exports.RepositoryModule = RepositoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                identity_entity_1.IdentityEntity,
                profile_identity_1.ProfileEntity,
                product_entity_1.ProductEntity,
                order_entity_1.OrderEntity,
                order_items_entity_1.OrderItemEntity,
                discount_ticket_entity_1.DiscountTicketEntity,
                user_ticket_entity_1.UserTicketEntity,
                order_ticket_entity_1.OrderTicketEntity,
            ]),
        ],
        providers: [
            repository_service_1.RepositoryService,
            identity_repository_1.IdentityRepository,
            profile_repository_1.ProfileRepository,
            product_repository_1.ProductRepository,
            order_repository_1.OrderRepository,
            order_item_repository_1.OrderItemRepository,
            discount_ticket_repository_1.DiscountTicketRepository,
            user_ticket_repository_1.UserTicketRepository,
            order_ticket_repository_1.OrderTicketRepository,
        ],
        exports: [repository_service_1.RepositoryService],
    })
], RepositoryModule);
//# sourceMappingURL=repository.module.js.map