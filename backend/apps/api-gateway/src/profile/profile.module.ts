import process from 'node:process';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/common';
import { IdentityModule } from '../identity/identity.module';
import { IdentityStrategy } from '../strategy/identity.strategy';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';

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
  providers: [IdentityStrategy],
})
export class ProfileModule {}
