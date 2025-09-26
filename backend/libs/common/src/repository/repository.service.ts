import { Injectable } from "@nestjs/common";
import { ProfileRepository } from "@app/common/repository/profile.repository";
import { IdentityRepository } from "@app/common/repository/identity.repository";
import { ProductRepository } from "@app/common/repository/product.repository";
import { OrderRepository } from "@app/common/repository/order.repository";
import { OrderItemRepository } from "@app/common/repository/order-item.repository";

@Injectable()
export class RepositoryService {
    constructor(
        public readonly identity: IdentityRepository,
        public readonly profile: ProfileRepository,
        public readonly product: ProductRepository,
        public readonly order: OrderRepository,
        public readonly orderItem: OrderItemRepository,
    ) {}
}