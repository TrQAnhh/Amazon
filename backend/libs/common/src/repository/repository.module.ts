import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdentityEntity } from "../../../../apps/identity/src/entity/identity.entity";
import { ProductEntity } from "../../../../apps/product/src/entity/product.entity";
import { ProfileEntity } from "../../../../apps/profile/src/entity/profile.identity";
import { IdentityRepository } from "@app/common/repository/identity.repository";
import { ProfileRepository } from "@app/common/repository/profile.repository";
import { RepositoryService } from "@app/common/repository/repository.service";
import { ProductRepository} from "@app/common/repository/product.repository";
import { OrderEntity } from "../../../../apps/order/src/entity/order.entity";
import { OrderItemEntity } from "../../../../apps/order/src/entity/order-items.entity";
import {OrderItemRepository} from "@app/common/repository/order-item.repository";
import {OrderRepository} from "@app/common/repository/order.repository";

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