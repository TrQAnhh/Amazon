import {Module} from '@nestjs/common';
import {IdentityServiceService} from './identity-service.service';
import {IdentityServiceController} from './identity-service.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {IDENTITY_SERVICE} from "./common/constants";
import {IDENTITY_SERVICE_PACKAGE_NAME} from "@libs/common";
import {join} from "path";

@Module({
  imports: [
      ClientsModule.register([
          {
              name: IDENTITY_SERVICE,
              transport: Transport.GRPC,
              options: {
                  package: IDENTITY_SERVICE_PACKAGE_NAME,
                  protoPath: join(__dirname, '../identity-service.proto'),
              }
          }
      ])
  ],
  controllers: [IdentityServiceController],
  providers: [IdentityServiceService],
})
export class IdentityServiceModule {}
