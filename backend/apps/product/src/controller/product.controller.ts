import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from '@app/common';
import { CreateProductCommand } from '../commands/create-product/create-product.command';
import { ProductEntity } from '../entity/product.entity';
import { GetAllProductsQuery } from '../queries/get-all-products/get-all-products.query';

@Controller()
export class ProductController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(createProductDto: CreateProductDto) {
    return this.commandBus.execute(new CreateProductCommand(createProductDto));
  }

  @MessagePattern({ cmd: 'get_all_products' })
  async getAllProducts(): Promise<ProductEntity[]> {
    return this.queryBus.execute(new GetAllProductsQuery());
  }
}
