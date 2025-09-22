import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductDetailQuery } from './get-product-detail.query';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { assertExists, ErrorCode, ProductResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler implements IQueryHandler<GetProductDetailQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(query: GetProductDetailQuery): Promise<ProductResponseDto> {
    const { sku } = query;

    const existingProduct = await assertExists<ProductEntity>(this.productRepo, { sku }, ErrorCode.PRODUCT_NOT_FOUND);

    return plainToInstance(ProductResponseDto, existingProduct, {
      excludeExtraneousValues: true,
    });
  }
}
