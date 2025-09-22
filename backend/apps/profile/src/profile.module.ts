import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileEntity } from './entity/profile.identity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { APP_FILTER } from '@nestjs/core';
import { ProfileExceptionFilter } from './exception/profile-exception.filter';
import { SERVICE_NAMES } from '@app/common/constants/service-names';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateProfileHandler } from './commands/create-profile/create-profile.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserProfileHandler } from './queries/get-user-profile/get-user-profile.handler';
import { GetAllUserProfilesHandler } from './queries/get-all-user-profiles/get-all-user-profiles.handler';
import { UpdateProfileHandler } from './commands/update-profile/update-profile.handler';
import { UploadAvatarHandler } from './commands/upload-avatar/upload-avatar.handler';
import { CloudinaryModule } from '@app/common';

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
    CqrsModule,
  ],
  controllers: [ProfileController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ProfileExceptionFilter,
    },
    CreateProfileHandler,
    GetUserProfileHandler,
    GetAllUserProfilesHandler,
    UpdateProfileHandler,
    UploadAvatarHandler,
  ],
})
export class ProfileModule {}
