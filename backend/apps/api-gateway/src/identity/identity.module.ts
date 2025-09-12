import {Module} from '@nestjs/common';
import {IdentityService} from './identity.service';
import {IdentityController} from './identity.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {SERVICE_NAMES} from "../common/constants/service-names";
import {IDENTITY_PACKAGE_NAME} from "@app/common";
import {join} from "path";

@Module({
  imports: [
      ClientsModule.register([
        {
            name: SERVICE_NAMES.IDENTITY,
            transport: Transport.GRPC,
            options: {
                package: IDENTITY_PACKAGE_NAME,
                protoPath: join(__dirname, '../identity.proto'),
            }
        }
      ])
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
