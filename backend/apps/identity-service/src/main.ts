import { NestFactory } from '@nestjs/core';
import { IdentityServiceModule } from './identity-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IDENTITY_SERVICE_PACKAGE_NAME } from '@libs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../identity-service.proto'),
        package: IDENTITY_SERVICE_PACKAGE_NAME,
      },
    },
  );

  await app.listen();
}
bootstrap();
