import { Module } from '@nestjs/common';
import { IdentityController } from './controller/identity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityEntity } from './entity/identity.entity';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { IdentityExceptionFilter } from './exception/identity-exception.filter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from "@nestjs/cqrs";
import { GetUserIdentityHandler } from "./queries/get-user-identity/get-user-identity.handler";
import { GetUserIdentitiesHandler } from "./queries/get-user-identities/get-user-identities.handler";
import { SignUpHandler } from "./commands/sign-up/sign-up.handler";
import { SignInHandler } from "./commands/sign-in/sign-in.handler";
import { ValidateTokenHandler } from "./queries/validate-token/validate-token.handler";
import { SERVICE_NAMES } from "@app/common";
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forFeature([IdentityEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
      },
    }),
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
    CqrsModule,
  ],
  controllers: [IdentityController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: IdentityExceptionFilter,
    },
    GetUserIdentityHandler,
    GetUserIdentitiesHandler,
    SignUpHandler,
    SignInHandler,
    ValidateTokenHandler,
  ],
})
export class IdentityModule {}
