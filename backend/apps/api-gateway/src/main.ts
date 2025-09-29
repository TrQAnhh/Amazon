import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiGatewayModule } from './api-gateway.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  const config = new DocumentBuilder()
      .setTitle('E-Commerce')
      .setDescription('The e-commerce platform API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(process.env.API_GATEWAY_PORT));
  logger.log(`API Gateway is running on port ${process.env.API_GATEWAY_PORT}`);
}
bootstrap();
