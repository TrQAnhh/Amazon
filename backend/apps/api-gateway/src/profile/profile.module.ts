import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { SERVICE_NAMES } from "@app/common/constants/service-names";
import process from "node:process";
import { IdentityModule } from "../identity/identity.module";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import {IdentityStrategy} from "../strategy/identity.strategy";
import {PassportModule} from "@nestjs/passport";
import {RolesGuard} from "../guard/roles.guard";

@Module({
  imports: [
      IdentityModule,
      PassportModule,
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
  providers: [
      IdentityStrategy,
      RolesGuard,
  ],
})
export class ProfileModule {}
