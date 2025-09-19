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

dotenv.config();

@Module({
  imports: [IdentityModule, ProfileModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
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
