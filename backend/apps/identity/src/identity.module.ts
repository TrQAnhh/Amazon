import { Module } from '@nestjs/common';
import { IdentityController } from './controller/identity.controller';
import { IdentityService } from './service/identity.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {IdentityEntity} from "./entity/identity.entity";
import {typeOrmConfigAsync} from "./config/typeorm.config";
import {APP_FILTER} from "@nestjs/core";
import {GrpcServerExceptionFilter} from "nestjs-grpc-exceptions";

@Module({
  imports: [
      TypeOrmModule.forRootAsync(typeOrmConfigAsync),
      TypeOrmModule.forFeature([IdentityEntity]),

  ],
  controllers: [IdentityController],
  providers: [
      IdentityService,
      {
          provide: APP_FILTER,
          useClass: GrpcServerExceptionFilter,
      },
  ],
})
export class IdentityModule {}
