import {Body, Controller, Inject, Patch} from '@nestjs/common';
import {BaseController} from "../common/base/base.controller";
import {SERVICE_NAMES} from "@app/common/constants/service-names";
import {ClientProxy} from "@nestjs/microservices";
import {UpdateProfileDto} from "@app/common/dto/profile/update-profile.dto";

@Controller('profile')
export class ProfileController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PROFILE) protected client: ClientProxy) {
      super(client);
  }

  @Patch('update')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
      return 'test updateProfileDto';
  }
}
