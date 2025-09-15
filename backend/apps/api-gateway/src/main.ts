import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Blog');

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(3000);

  logger.log(`API Gateway is running on port 3000.`);
}
bootstrap();
