import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderProductsQuery } from './get-order-products.query';
import { OrderProductDto } from '@app/common';
import { plainToInstance } from 'class-transformer';
import { RepositoryService } from '@repository/repository.service';

@QueryHandler(GetOrderProductsQuery)
export class GetOrderProductsHandler implements IQueryHandler<GetOrderProductsQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetOrderProductsQuery): Promise<OrderProductDto[]> {
    const { productIds } = query;

    const products = await this.repository.product.findByIds(productIds);

    return products.map((product) => {
      return plainToInstance(OrderProductDto, product, {
        excludeExtraneousValues: true,
      });
    });
  }
}
