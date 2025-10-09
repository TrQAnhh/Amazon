import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderProductDetailsQuery } from './get-order-product-details.query';
import { GetOrderProductsQuery } from '../get-order-products/get-order-products.query';
import { plainToInstance } from 'class-transformer';
import { OrderProductDetailDto } from '@app/common';
import { RepositoryService } from '@repository/repository.service';

@QueryHandler(GetOrderProductDetailsQuery)
export class GetOrderProductDetailsHandler implements IQueryHandler<GetOrderProductDetailsQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetOrderProductsQuery): Promise<OrderProductDetailDto[]> {
    const { productIds } = query;

    const products = await this.repository.product.findByIds(productIds);

    return products.map((product) => {
      return plainToInstance(OrderProductDetailDto, product, {
        excludeExtraneousValues: true,
      });
    });
  }
}
