import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductDetailQuery } from './get-product-detail.query';
import { ErrorCode, ProductResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import { RepositoryService } from '@repository/repository.service';

@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler implements IQueryHandler<GetProductDetailQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetProductDetailQuery): Promise<ProductResponseDto> {
    const { sku } = query;

    const existingProduct = await this.repository.product.findBySku(sku);

    if (!existingProduct) {
      throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);
    }

    return plainToInstance(ProductResponseDto, existingProduct, {
      excludeExtraneousValues: true,
    });
  }
}
