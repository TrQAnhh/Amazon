import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAMES} from "@app/common/constants/service-names";
import process from "node:process";

@Module({
  imports: [
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
  controllers: [ProfileController],
  providers: [],
})
export class ProfileModule {}
