import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { OrderExceptionFilter } from './exception/order-exception.filter';
import { StripeModule } from './modules/stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {  SERVICE_NAMES } from '@app/common';
import { CreateOrderHandler } from './commands/create-order/create-order.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { typeOrmConfigAsync } from "./config/typeorm.config";
import { GetAllOrdersHandler } from "./queries/get-all-orders/get-all-orders.handler";
import { GetOrderHandler } from "./queries/get-order/get-order.handler";
import { CheckOutHandler } from "./commands/check-out/check-out.handler";
import { CancelOrderHandler } from "./commands/cancel-order/cancel-order.handler";
import { StripeWebhookHandler } from "./commands/stripe-webhook/stripe-webhook.handler";
import { UpdateOrderHandler } from "./commands/update-order/update-order.handler";
import { RepositoryModule } from "@repository/repository.module";
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    StripeModule,
    RepositoryModule,
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    StripeModule.forRoot(process.env.STRIPE_API_KEY!, { apiVersion: '2025-08-27.basil' }),
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
    ClientsModule.register([
      {
          name: SERVICE_NAMES.PROFILE,
          transport: Transport.TCP,
          options: {
              host: process.env.PROFILE_SERVICE_HOST,
              port: Number(process.env.PROFILE_SERVICE_PORT),
          },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderHandler,
    GetAllOrdersHandler,
    GetOrderHandler,
    CheckOutHandler,
    UpdateOrderHandler,
    CancelOrderHandler,
    StripeWebhookHandler,
    {
      provide: APP_FILTER,
      useClass: OrderExceptionFilter,
    },
  ],
})
export class OrderModule {}
