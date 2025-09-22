import { GetAllProductsQuery } from './get-all-products.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductEntity } from '../../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler implements IQueryHandler<GetAllProductsQuery> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async execute(query: GetAllProductsQuery): Promise<ProductEntity[]> {
    return await this.productRepo.find({
      where: {
        isDeleted: false,
      },
    });
  }
}
