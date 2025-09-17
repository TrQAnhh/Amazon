import { Body, Controller, Get, Inject, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BaseController } from "../common/base/base.controller";
import { SERVICE_NAMES } from "@app/common/constants/service-names";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateProfileDto } from "@app/common/dto/profile/request/update-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserRole } from "@app/common/constants/user-role.enum";
import { Roles } from "../common/decorators/roles.decorator";

@Controller('profile')
export class ProfileController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PROFILE) protected client: ClientProxy) {
      super(client);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUserProfiles(@Req() request: any) {
        console.log(request);
  }

  @Get('/me')
  async getUserProfile(@Req() request:any) {
      const userId = request.user.userId;
      return await this.sendCommand({ cmd: 'get_user_profile'},userId);
  }

  @Patch('/update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
      @Req() request: any,
      @Body() updateProfileDto: UpdateProfileDto,
      @UploadedFile() avatar?: Express.Multer.File)
  {
      const userId = request.user.userId;

      let avatarPayload: any = null;
      if (avatar) {
          avatarPayload = {
              filename: avatar.originalname,
              mimetype: avatar.mimetype,
              buffer: avatar.buffer.toString('base64'),
          };
      }
      return await this.sendCommand({ cmd: 'update_user_profile'}, { userId, updateProfileDto, avatarPayload });
  }
}
