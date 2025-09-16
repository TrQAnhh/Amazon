import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import {APP_FILTER, APP_GUARD} from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './exception/api-gateway.filter';
import { ProfileModule } from "./profile/profile.module";
import {RolesGuard} from "./guard/roles.guard";

@Module({
  imports: [IdentityModule, ProfileModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: RpcToHttpExceptionFilter,
    },
  ],
})
export class ApiGatewayModule {}
