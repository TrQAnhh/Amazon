import { GetAllProductsQuery } from './get-all-products.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductEntity } from '../../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(query: GetAllProductsQuery): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: {
        isDeleted: false,
      },
    });

    return plainToInstance(ProductResponseDto, products, {
      excludeExtraneousValues: true,
    });
  }
}
