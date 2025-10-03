import { GetAllProductsQuery } from './get-all-products.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';
import { RepositoryService } from '@repository/repository.service';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetAllProductsQuery): Promise<ProductResponseDto[]> {
    const products = await this.repository.product.findAll();

    return plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
  }
}
