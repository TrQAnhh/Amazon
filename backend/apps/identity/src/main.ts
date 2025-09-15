import {NestFactory} from '@nestjs/core';
import {IdentityModule} from './identity.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {join} from 'path';
import {IDENTITY_PACKAGE_NAME} from "@app/common";
import {ExceptionFilter} from "@app/common/filters/rpc-exception.filter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      IdentityModule,
      {
          transport: Transport.GRPC,
          options: {
              protoPath: join(__dirname,'../identity.proto'),
              package: IDENTITY_PACKAGE_NAME
          }
      }
  );

  await app.listen();
}
bootstrap();
