import { Module } from '@nestjs/common';
import { IdentityModule } from './identity/identity.module';
import {APP_FILTER, APP_GUARD} from '@nestjs/core';
import { RpcToHttpExceptionFilter } from './exception/api-gateway.filter';
import { ProfileModule } from "./profile/profile.module";
import {JwtAuthGuard} from "./guard/jwt-auth.guard";
import {RolesGuard} from "./guard/roles.guard";

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
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class ApiGatewayModule {}
