import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './exception/api-gateway.filter';
import { ProfileModule } from './profile/profile.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { ErrorsInterceptor } from './common/interceptors/errors/errors.interceptor';
import { TimeoutInterceptor } from './common/interceptors/errors/timeout.interceptor';
import { ProductModule } from './product/product.module';
import { AppGuard } from './guard/global.guard';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { RawBodyMiddleware } from "./common/middleware/raw-body.middleware";
import {JsonBodyMiddleware} from "./common/middleware/json-body.middleware";

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IdentityModule,
    ProfileModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class ApiGatewayModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RawBodyMiddleware)
            .forRoutes({
                path: '/stripe/webhook',
                method: RequestMethod.POST,
            })
            .apply(JsonBodyMiddleware)
            .forRoutes('*');
    }
}
