import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';
import { ProfileEntity } from './entity/profile.identity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { APP_FILTER } from '@nestjs/core';
import { ProfileExceptionFilter } from './exception/profile-exception.filter';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { SERVICE_NAMES } from '@app/common/constants/service-names';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ClientsModule, Transport } from '@nestjs/microservices';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TypeOrmModule.forFeature([ProfileEntity]),
    CloudinaryModule,
    ClientsModule.register([
      {
        name: SERVICE_NAMES.IDENTITY,
        transport: Transport.TCP,
        options: {
          host: process.env.IDENTITY_SERVICE_HOST,
          port: Number(process.env.IDENTITY_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: APP_FILTER,
      useClass: ProfileExceptionFilter,
    },
  ],
})
export class ProfileModule {}
