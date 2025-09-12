import { Module } from '@nestjs/common';
import { IdentityController } from './controller/identity.controller';
import { IdentityService } from './service/identity.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {IdentityEntity} from "./entity/identity.entity";
import {typeOrmConfigAsync} from "./config/typeorm.config";

@Module({
  imports: [
      TypeOrmModule.forRootAsync(typeOrmConfigAsync),
      TypeOrmModule.forFeature([IdentityEntity]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
