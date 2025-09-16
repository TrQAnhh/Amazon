import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import { APP_FILTER } from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './exception/api-gateway.filter';
import {ProfileModule} from "./profile/profile.module";

@Module({
  imports: [IdentityModule, ProfileModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
})
export class ApiGatewayModule {}
