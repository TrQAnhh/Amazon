import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './exception/api-gateway.filter';
import { ProfileModule } from './profile/profile.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { ErrorsInterceptor } from './common/interceptors/errors/errors.interceptor';
import { TimeoutInterceptor } from './common/interceptors/errors/timeout.interceptor';
import * as dotenv from 'dotenv';
import { ProductModule } from './product/product.module';
import { AppGuard } from './guard/global.guard';

dotenv.config();

@Module({
  imports: [IdentityModule, ProductModule, ProfileModule],
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
export class ApiGatewayModule {}
