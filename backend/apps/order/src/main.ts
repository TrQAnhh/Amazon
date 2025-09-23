import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { OrderModule } from './order.module';
import * as dotenv from 'dotenv';

const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  console.log(process.env.ORDER_SERVICE_PORT);

  const app = await NestFactory.createMicroservice(OrderModule, {
    transports: Transport.TCP,
    options: {
      port: Number(process.env.ORDER_SERVICE_PORT),
    },
  });

  await app.listen();
  logger.log(`TCP Microservice of Order Service is now running on port ${process.env.ORDER_SERVICE_PORT}.`);
}
bootstrap();
