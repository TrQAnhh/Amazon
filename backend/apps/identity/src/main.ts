import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IdentityModule, {
    transport: Transport.TCP,
    options: {
      port: Number(process.env.IDENTITY_SERVICE_PORT),
      host: '0.0.0.0',
    },
  });

  await app.listen();
  logger.log(`TCP Microservice of Identity Service is now running on port ${process.env.IDENTITY_SERVICE_PORT}.`);
}

bootstrap();
