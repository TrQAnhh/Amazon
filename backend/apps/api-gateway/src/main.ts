import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(Number(process.env.API_GATEWAY_PORT));

  logger.log(`API Gateway is running on port ${process.env.API_GATEWAY_PORT}`);
}
bootstrap();
