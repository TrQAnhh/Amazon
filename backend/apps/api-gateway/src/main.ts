import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Blog');

async function bootstrap() {

  const httpPort = process.env.HTTP_PORT || 3000;
  const tcpPort = process.env.TCP_PORT || 4000;

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);

  logger.log(`Api gateway is listening on ${httpPort}`);
}
bootstrap();
