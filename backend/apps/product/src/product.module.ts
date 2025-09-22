import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { GetAllProductsHandler } from './queries/get-all-products/get-all-products.handler';
import { APP_FILTER } from '@nestjs/core';
import { ProductExceptionFilter } from './exception/product-exception.filter';
import { CloudinaryModule } from '@app/common';
import { UpdateProductHandler } from './commands/update-product/update-product.handler';
import { GetProductDetailHandler } from './queries/get-product-detail/get-product-detail.handler';
import { DeleteProductHandler } from './commands/delete-product/delete-product.handler';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forFeature([ProductEntity]),
    CloudinaryModule,
    CqrsModule,
  ],
  controllers: [ProductController],
  providers: [
    CreateProductHandler,
    GetAllProductsHandler,
    GetProductDetailHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    {
      provide: APP_FILTER,
      useClass: ProductExceptionFilter,
    },
  ],
})
export class ProductModule {}
