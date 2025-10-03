import { Body, Controller, Get, Inject, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminProfileResponseDto, ProfileResponseDto, SERVICE_NAMES, UpdateProfileDto, UserRole } from '@app/common';
import { BaseController } from '../common/base/base.controller';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from '../common/decorators/roles.decorator';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Profile service')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthenticated access' })
@ApiBadRequestResponse({ description: 'Profile not found' })
@Controller('profile')
export class ProfileController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.PROFILE) protected client: ClientProxy) {
    super(client);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOkResponse({ description: 'Get all users profile successfully', type: [AdminProfileResponseDto] })
  @ApiForbiddenResponse({ description: 'Unauthorized access' })
  async getAllUserProfiles(): Promise<Response<AdminProfileResponseDto[]>> {
    const result = await this.sendCommand<AdminProfileResponseDto[]>({ cmd: 'get_all_user_profiles' });
    return {
      message: 'Get all users profile successfully!',
      success: true,
      data: result,
    };
  }

  @Get('/me')
  @ApiOkResponse({ description: 'Get user profile successfully', type: ProfileResponseDto })
  async getUserProfile(@Req() request: any): Promise<Response<ProfileResponseDto>> {
    const userId = request.user.userId;
    const result = await this.sendCommand<ProfileResponseDto>({ cmd: 'get_user_profile' }, { userId });
    return {
      message: 'Get user profile successfully',
      success: true,
      data: result,
    };
  }

  @Patch('/update')
  @ApiOkResponse({ description: 'Update user profile successfully', type: ProfileResponseDto })
  async updateProfile(
    @Req() request: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Response<ProfileResponseDto>> {
    const userId = request.user.userId;

    const result = await this.sendCommand<ProfileResponseDto>(
      { cmd: 'update_user_profile' },
      { userId, updateProfileDto },
    );

    return {
      message: 'Update user profile successfully',
      success: true,
      data: result,
    };
  }

  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['avatar'],
    },
  })
  @ApiOkResponse({ description: 'Upload avatar successfully' })
  async uploadUserAvatar(@Req() request: any, @UploadedFile() avatar: Express.Multer.File): Promise<Response<string>> {
    const userId = request.user.userId;

    let avatarPayload: any = null;
    if (avatar) {
      avatarPayload = {
        filename: avatar.originalname,
        mimetype: avatar.mimetype,
        buffer: avatar.buffer.toString('base64'),
      };
    }

    const result = await this.sendCommand<string>({ cmd: 'upload_user_avatar' }, { userId, avatarPayload });
    return {
      message: 'Upload avatar successfully',
      success: true,
      data: result,
    };
  }
}
