import { Body, Controller, Get, Inject, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BaseController } from "../common/base/base.controller";
import { SERVICE_NAMES } from "@app/common/constants/service-names";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateProfileDto } from "@app/common/dto/profile/request/update-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserRole } from "@app/common/constants/user-role.enum";
import { Roles } from "../common/decorators/roles.decorator";
import { Response } from "../common/interceptors/transform/transform.interceptor";
import {ProfileResponseDto} from "@app/common/dto/profile/response/profile-response.dto";

@Controller('profile')
export class ProfileController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PROFILE) protected client: ClientProxy) {
      super(client);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUserProfiles(): Promise<Response<ProfileResponseDto[]>> {
      const result = await this.sendCommand<ProfileResponseDto[]>({ cmd: 'get_all_user_profiles' });
      return {
          message: 'Get all users profile successfully!',
          success: true,
          data: result,
      }
  }

  @Get('/me')
  async getUserProfile(@Req() request:any): Promise<Response<ProfileResponseDto>> {
      const userId = request.user.userId;
      const result = await this.sendCommand<ProfileResponseDto>({ cmd: 'get_user_profile'},{ userId });
      return {
          message: 'Get user profile successfully!',
          success: true,
          data: result,
      }
  }

  @Patch('/update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
      @Req() request: any,
      @Body() updateProfileDto: UpdateProfileDto,
      @UploadedFile() avatar?: Express.Multer.File): Promise<Response<ProfileResponseDto>>
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
      const result = await this.sendCommand<ProfileResponseDto>({ cmd: 'update_user_profile'}, { userId, updateProfileDto, avatarPayload });
      return {
          message: 'Update user profile successfully!',
          success: true,
          data: result,
      }
  }
}
