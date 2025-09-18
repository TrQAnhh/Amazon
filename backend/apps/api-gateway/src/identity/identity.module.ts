import { Module } from '@nestjs/common';
import { IdentityController } from './identity.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/common';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

@Module({
  imports: [
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
  controllers: [IdentityController],
  providers: [],
  exports: [ClientsModule],
})
export class IdentityModule {}
