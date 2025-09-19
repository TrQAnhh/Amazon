import { Body, Controller, Get, Inject, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfileResponseDto, SERVICE_NAMES, UpdateProfileDto, UserRole } from '@app/common';
import { BaseController } from '../common/base/base.controller';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { Response } from '../common/interceptors/transform/transform.interceptor';

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
    };
  }

  @Get('/me')
  async getUserProfile(@Req() request: any): Promise<Response<ProfileResponseDto>> {
    const userId = request.user.userId;
    const result = await this.sendCommand<ProfileResponseDto>({ cmd: 'get_user_profile' }, { userId });
    return {
      message: 'Get user profile successfully!',
      success: true,
      data: result,
    };
  }

  @Patch('/update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Req() request: any,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<Response<ProfileResponseDto>> {
    const userId = request.user.userId;

    let avatarPayload: any = null;
    if (avatar) {
      avatarPayload = {
        filename: avatar.originalname,
        mimetype: avatar.mimetype,
        buffer: avatar.buffer.toString('base64'),
      };
    }

    const result = await this.sendCommand<ProfileResponseDto>({ cmd: 'update_user_profile' }, { userId, updateProfileDto, avatarPayload });
    return {
      message: 'Update user profile successfully!',
      success: true,
      data: result,
    };
  }
}
