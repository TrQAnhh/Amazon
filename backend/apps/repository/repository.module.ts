import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdentityEntity } from "../identity/src/entity/identity.entity";
import { ProductEntity } from "../product/src/entity/product.entity";
import { ProfileEntity } from "../profile/src/entity/profile.identity";
import { IdentityRepository } from "./identity.repository";
import { ProfileRepository } from "./profile.repository";
import { RepositoryService } from "./repository.service";
import { ProductRepository} from "./product.repository";
import { OrderEntity } from "../order/src/entity/order.entity";
import { OrderItemEntity } from "../order/src/entity/order-items.entity";
import {OrderItemRepository} from "./order-item.repository";
import {OrderRepository} from "./order.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IdentityEntity,
            ProfileEntity,
            ProductEntity,
            OrderEntity,
            OrderItemEntity,
        ]),
    ],
    providers: [
        RepositoryService,
        IdentityRepository,
        ProfileRepository,
        ProductRepository,
        OrderRepository,
        OrderItemRepository,
    ],
    exports: [
        RepositoryService
    ],
})
export class RepositoryModule{}