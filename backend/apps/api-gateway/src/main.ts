import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(Number(process.env.API_GATEWAY_PORT));

  logger.log(`API Gateway is running on port ${process.env.API_GATEWAY_PORT}`);
}
bootstrap();
