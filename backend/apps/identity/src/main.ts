import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { Logger } from '@nestjs/common';

const logger = new Logger('Blog');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(IdentityModule, {
    transport: Transport.TCP,
    options: {
      port: 4001,
    },
  });

  await app.listen();
  logger.log(`TCP Microservice of Identity Service is now running.`);
}

bootstrap();
