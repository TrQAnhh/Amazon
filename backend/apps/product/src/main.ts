import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  console.log(process.env.PRODUCT_SERVICE_PORT);

  const app = await NestFactory.createMicroservice(ProductModule, {
    transports: Transport.TCP,
    options: {
      port: Number(process.env.PRODUCT_SERVICE_PORT),
      host: '0.0.0.0',
    },
  });

  await app.listen();
  logger.log(`TCP Microservice of Product Service is now running on port ${process.env.PRODUCT_SERVICE_PORT}.`);
}
bootstrap();
