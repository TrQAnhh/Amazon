import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/common';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICE_NAMES.PRODUCT,
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_SERVICE_HOST,
          port: Number(process.env.PRODUCT_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
