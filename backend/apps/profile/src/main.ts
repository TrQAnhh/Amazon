import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfileModule, {
    transport: Transport.TCP,
    options: {
      port: Number(process.env.PROFILE_SERVICE_PORT),
      host: '0.0.0.0',
    },
  });

  await app.listen();
  logger.log(`TCP Microservice of Profile Service is now running on port ${process.env.PROFILE_SERVICE_PORT}.`);
}
bootstrap();
