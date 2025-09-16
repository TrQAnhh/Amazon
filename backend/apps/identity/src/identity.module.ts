import { Module } from '@nestjs/common';
import { IdentityController } from './controller/identity.controller';
import { IdentityService } from './service/identity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityEntity } from './entity/identity.entity';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { IdentityExceptionFilter } from './exception/identity-exception.filter';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAMES} from "@app/common/constants/service-names";

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
  ],
  controllers: [IdentityController],
  providers: [
    IdentityService,
    {
      provide: APP_FILTER,
      useClass: IdentityExceptionFilter,
    },
  ],
})
export class IdentityModule {}
