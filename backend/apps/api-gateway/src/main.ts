import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiGatewayModule } from './api-gateway.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

const logger = new Logger('Blog');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule,{
      bodyParser: false,
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

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
