import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "./profile.repository";
import { IdentityRepository } from "./identity.repository";
import { ProductRepository } from "./product.repository";
import { OrderRepository } from "./order.repository";
import { OrderItemRepository } from "./order-item.repository";
import { DiscountTicketRepository } from "@repository/discount-ticket.repository";
import { UserTicketRepository } from "@repository/user-ticket.repository";
import { OrderTicketRepository } from "@repository/order-ticket.repository";

@Injectable()
export class RepositoryService {
    constructor(
        public readonly identity: IdentityRepository,
        public readonly profile: ProfileRepository,
        public readonly product: ProductRepository,
        public readonly order: OrderRepository,
        public readonly orderItem: OrderItemRepository,
        public readonly discountTicket: DiscountTicketRepository,
        public readonly userTicket: UserTicketRepository,
        public readonly orderTicket: OrderTicketRepository,
    ) {}
}