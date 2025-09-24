import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import {
    CreateProductDto,
    OrderProductDetailDto,
    OrderProductDto,
    ProductResponseDto,
    UpdateProductDto
} from '@app/common';
import { CreateProductCommand } from '../commands/create-product/create-product.command';
import { GetAllProductsQuery } from '../queries/get-all-products/get-all-products.query';
import { UpdateProductCommand } from '../commands/update-product/update-product.command';
import { GetProductDetailQuery } from '../queries/get-product-detail/get-product-detail.query';
import { DeleteProductCommand } from '../commands/delete-product/delete-product.command';
import { GetOrderProductsQuery } from '../queries/get-order-products/get-order-products.query';
import { UpdateStockCommand } from "../commands/update-stock/update-stock.command";
import { GetOrderProductDetailsQuery } from "../queries/get-order-product-details/get-order-product-details.query";

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

  @MessagePattern({ cmd: 'get_order_products' })
  async getOrderProducts(payload: { productIds: number[] }): Promise<OrderProductDto> {
    return this.queryBus.execute(new GetOrderProductsQuery(payload.productIds));
  }

  @MessagePattern({ cmd: 'get_order_product_details' })
  async getOrderProductDetails(payload: { productIds: number[] }): Promise<OrderProductDetailDto> {
    return this.queryBus.execute(new GetOrderProductDetailsQuery(payload.productIds));
  }

  @MessagePattern({ cmd: 'update_product' })
  async updateProduct(payload: {
    id: number;
    updateProductDto: UpdateProductDto;
    imagePayload: any;
  }): Promise<string> {
    return this.commandBus.execute(
      new UpdateProductCommand(payload.id, payload.updateProductDto, payload.imagePayload),
    );
  }

  @MessagePattern({ cmd: 'update_stock' })
  async updateStock(payload: { items: {productId: number; newStock: number }[] }): Promise<boolean> {
      return this.commandBus.execute(new UpdateStockCommand(payload.items));
  }

  @MessagePattern({ cmd: 'delete_product' })
  async deleteProduct(payload: { id: number }): Promise<string> {
    return this.commandBus.execute(new DeleteProductCommand(payload.id));
  }
}
