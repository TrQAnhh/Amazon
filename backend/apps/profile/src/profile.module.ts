import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';
import { ProfileEntity } from './entity/profile.identity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import {APP_FILTER} from "@nestjs/core";
import {ProfileExceptionFilter} from "./exception/profile-exception.filter";
import {CloudinaryModule} from "./modules/cloudinary/cloudinary.module";

@Module({
  imports: [
      TypeOrmModule.forRootAsync(typeOrmConfigAsync),
      TypeOrmModule.forFeature([ProfileEntity]),
      CloudinaryModule,
  ],
  controllers: [ProfileController],
  providers: [
      ProfileService,
      {
          provide: APP_FILTER,
          useClass: ProfileExceptionFilter,
      }
  ],
})
export class ProfileModule {}
