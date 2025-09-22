import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from '@app/common';
import { CreateProductCommand } from '../commands/create-product/create-product.command';
import { GetAllProductsQuery } from '../queries/get-all-products/get-all-products.query';
import { UpdateProductCommand } from '../commands/update-product/update-product.command';
import { GetProductDetailQuery } from '../queries/get-product-detail/get-product-detail.query';
import { DeleteProductCommand } from '../commands/delete-product/delete-product.command';

@Controller()
export class ProductController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'create_product' })
  async createProduct(payload: { createProductDto: CreateProductDto; imagePayload: any }): Promise<ProductResponseDto> {
    return this.commandBus.execute(new CreateProductCommand(payload.createProductDto, payload.imagePayload));
  }

  @MessagePattern({ cmd: 'get_all_products' })
  async getAllProducts(): Promise<ProductResponseDto[]> {
    return this.queryBus.execute(new GetAllProductsQuery());
  }

  @MessagePattern({ cmd: 'get_product_detail' })
  async getProductDetail(payload: { sku: string }): Promise<ProductResponseDto> {
    return this.queryBus.execute(new GetProductDetailQuery(payload.sku));
  }

  @MessagePattern({ cmd: 'update_product' })
  async updateProduct(payload: {
    sku: string;
    updateProductDto: UpdateProductDto;
    imagePayload: any;
  }): Promise<string> {
    return this.commandBus.execute(
      new UpdateProductCommand(payload.sku, payload.updateProductDto, payload.imagePayload),
    );
  }

  @MessagePattern({ cmd: 'delete_product' })
  async deleteProduct(payload: { sku: string }): Promise<string> {
    return this.commandBus.execute(new DeleteProductCommand(payload.sku));
  }
}
