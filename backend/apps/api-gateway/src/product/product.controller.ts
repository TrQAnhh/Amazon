import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../common/base/base.controller';
import { CreateProductDto, SERVICE_NAMES, UpdateProductDto, UserRole } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../../product/src/entity/product.entity';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductResponseDto } from '@app/common/dto/product/response';
import { Public } from '../common/decorators/public.decorator';

@Roles(UserRole.ADMIN)
@Controller('product')
export class ProductController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PRODUCT) protected client: ClientProxy) {
    super(client);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Response<ProductResponseDto>> {
    let imagePayload: any = null;

    if (image) {
      imagePayload = {
        filename: image.originalname,
        mimetype: image.mimetype,
        buffer: image.buffer.toString('base64'),
      };
    }

    const result = await this.sendCommand<ProductResponseDto>(
      { cmd: 'create_product' },
      { createProductDto, imagePayload },
    );

    return {
      message: 'Create new product successfully!',
      success: true,
      data: result,
    };
  }

  @Public()
  @Get()
  async getAllProducts(): Promise<Response<ProductResponseDto[]>> {
    const result = await this.sendCommand<ProductResponseDto[]>({ cmd: 'get_all_products' });
    return {
      message: 'Get all products successfully!',
      success: true,
      data: result,
    };
  }

  @Public()
  @Get('/:sku')
  async getProductDetail(@Param('sku') sku: string): Promise<Response<ProductEntity[]>> {
    const result = await this.sendCommand<ProductEntity[]>({ cmd: 'get_product_detail' }, { sku });
    return {
      message: `Get product details of sku ${sku} successfully!`,
      success: true,
      data: result,
    };
  }

  @Patch('/update/:sku')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('sku') sku: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Response<any>> {
    let imagePayload: any = null;

    if (image) {
      imagePayload = {
        filename: image.originalname,
        mimetype: image.mimetype,
        buffer: image.buffer.toString('base64'),
      };
    }

    const message = await this.sendCommand<string>({ cmd: 'update_product' }, { sku, updateProductDto, imagePayload });
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Delete('/:sku')
  async deleteProduct(@Param('sku') sku: string): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'delete_product' }, { sku });
    return {
      message: message,
      success: true,
      data: null,
    };
  }
}
