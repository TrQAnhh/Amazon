import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../product/src/entity/product.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repo: Repository<ProductEntity>
    ) {}

    async findAll(): Promise<ProductEntity[]> {
        return this.repo.find({ where: { isDeleted: false } });
    }

    async findBySku(sku: string): Promise<ProductEntity | null> {
        return await this.repo.findOneBy({ sku });
    }

    async findById(id: number): Promise<ProductEntity | null> {
        return this.repo.findOneBy({ id });
    }

    async findByIds(productIds: number[]): Promise<ProductEntity[]> {
        return this.repo.find({ where: { id: In(productIds) } });
    }

    create(data: Partial<ProductEntity>): ProductEntity {
        return this.repo.create(data);
    }

    async save(product: ProductEntity): Promise<ProductEntity> {
        return this.repo.save(product);
    }

    async saveMany(products: ProductEntity[]): Promise<ProductEntity[]> {
        return this.repo.save(products);
    }

    async update(id: number, data: Partial<ProductEntity>): Promise<void> {
        await this.repo.update(id, data);
    }
}