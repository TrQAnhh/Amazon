import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAMES} from "@app/common/constants/service-names";
import process from "node:process";
import {IdentityModule} from "../identity/identity.module";
import {AuthGuard} from "../guard/auth.guard";

@Module({
  imports: [
      IdentityModule,
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
  providers: [AuthGuard],
})
export class ProfileModule {}
