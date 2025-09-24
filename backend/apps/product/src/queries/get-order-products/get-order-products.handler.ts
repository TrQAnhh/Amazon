import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderProductsQuery } from './get-order-products.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { In, Repository } from 'typeorm';
import { OrderProductDto } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetOrderProductsQuery)
export class GetOrderProductsHandler implements IQueryHandler<GetOrderProductsQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(query: GetOrderProductsQuery): Promise<OrderProductDto[]> {
    const { productIds } = query;

    const products = await this.productRepo.find({
      where: { id: In(productIds) },
    });

    return products.map((product) => {
      return plainToInstance(OrderProductDto, product, {
        excludeExtraneousValues: true,
      });
    });
  }
}
