import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiGatewayRpcExceptionFilter } from './exception/api-gateway.filter';

@Module({
  imports: [IdentityModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApiGatewayRpcExceptionFilter,
    },
  ],
})
export class ApiGatewayModule {}
