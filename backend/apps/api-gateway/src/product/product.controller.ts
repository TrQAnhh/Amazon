import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { BaseController } from '../common/base/base.controller';
import { CreateProductDto, SERVICE_NAMES } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../../product/src/entity/product.entity';
import { Response } from '../common/interceptors/transform/transform.interceptor';

@Controller('product')
export class ProductController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PRODUCT) protected client: ClientProxy) {
    super(client);
  }

  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Response<ProductEntity>> {
    const result = await this.sendCommand<ProductEntity>({ cmd: 'create_product' }, createProductDto);
    return {
      message: 'Create new product successfully!',
      success: true,
      data: result,
    };
  }

  @Get()
  async getAllProducts(): Promise<Response<ProductEntity[]>> {
    const result = await this.sendCommand<ProductEntity[]>({ cmd: 'get_all_products' });
    return {
      message: 'Get all products successfully!',
      success: true,
      data: result,
    };
  }
}
