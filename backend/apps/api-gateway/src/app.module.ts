import { Module } from '@nestjs/common';
import {IdentityServiceModule} from "./identity-service/identity-service.module";

@Module({
  imports: [IdentityServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
