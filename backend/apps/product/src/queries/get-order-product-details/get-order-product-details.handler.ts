import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetOrderProductDetailsQuery } from "./get-order-product-details.query";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entity/product.entity";
import { In, Repository } from "typeorm";
import { GetOrderProductsQuery } from "../get-order-products/get-order-products.query";
import { plainToInstance } from "class-transformer";
import { OrderProductDetailDto } from "@app/common";

@QueryHandler(GetOrderProductDetailsQuery)
export class GetOrderProductDetailsHandler implements IQueryHandler<GetOrderProductDetailsQuery> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
    ) {}

    async execute(query: GetOrderProductsQuery): Promise<OrderProductDetailDto[]> {
        const { productIds } = query;

        const products = await this.productRepo.find({
            where: { id: In(productIds) },
        });

        return products.map((product) => {
            return plainToInstance(OrderProductDetailDto, product, {
                excludeExtraneousValues: true,
            });
        });
    }
}