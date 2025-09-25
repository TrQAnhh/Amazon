import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdentityEntity } from "../../../../apps/identity/src/entity/identity.entity";
import { ProductEntity } from "../../../../apps/product/src/entity/product.entity";
import { ProfileEntity } from "../../../../apps/profile/src/entity/profile.identity";
import { IdentityRepository } from "@app/common/repository/identity.repository";
import { ProfileRepository } from "@app/common/repository/profile.repository";
import { RepositoryService } from "@app/common/repository/repository.service";
import {ProductRepository} from "@app/common/repository/product.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IdentityEntity,
            ProfileEntity,
            ProductEntity,
        ]),
    ],
    providers: [
        RepositoryService,
        IdentityRepository,
        ProfileRepository,
        ProductRepository,
    ],
    exports: [
        RepositoryService
    ],
})
export class RepositoryModule{}