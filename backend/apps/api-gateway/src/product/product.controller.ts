import { BaseController } from '../common/base/base.controller';
import { CreateProductDto, SERVICE_NAMES, UpdateProductDto, UserRole } from '@app/common';
import { ApiAdminResponse } from '../common/decorators/api-admin-response.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { ProductEntity } from '../../../product/src/entity/product.entity';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductResponseDto } from '@app/common/dto/product/response';
import { Public } from '../common/decorators/public.decorator';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Product service')
@Roles(UserRole.ADMIN)
@Controller('product')
export class ProductController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PRODUCT) protected client: ClientProxy) {
    super(client);
  }

  @Post('create')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ description: 'Create new product successfully', type: ProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated access' })
  @ApiForbiddenResponse({ description: 'Unauthorized access' })
  @ApiConflictResponse({ description: 'Product with this SKU already exists' })
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
      message: 'Create new product successfully',
      success: true,
      data: result,
    };
  }

  @Public()
  @Get()
  @ApiOkResponse({ description: 'Get all products successfully', type: [ProductResponseDto] })
  async getAllProducts(): Promise<Response<ProductResponseDto[]>> {
    const result = await this.sendCommand<ProductResponseDto[]>({ cmd: 'get_all_products' });
    return {
      message: 'Get all products successfully',
      success: true,
      data: result,
    };
  }

  @Public()
  @Get('/:sku')
  @ApiOkResponse({ description: 'Get product details of sku successfully', type: ProductResponseDto })
  async getProductDetail(@Param('sku') sku: string): Promise<Response<ProductResponseDto>> {
    const result = await this.sendCommand<ProductResponseDto>({ cmd: 'get_product_detail' }, { sku });
    return {
      message: `Get product details of sku ${sku} successfully`,
      success: true,
      data: result,
    };
  }

  @Patch('/update/:id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Update product successfully', type: ProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated access' })
  @ApiForbiddenResponse({ description: 'Unauthorized access' })
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') id: number,
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

    const message = await this.sendCommand<string>({ cmd: 'update_product' }, { id, updateProductDto, imagePayload });
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiAdminResponse('Product with id has been deleted successfully')
  async deleteProduct(@Param('id') id: number): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'delete_product' }, { id });
    return {
      message: message,
      success: true,
      data: null,
    };
  }
}
