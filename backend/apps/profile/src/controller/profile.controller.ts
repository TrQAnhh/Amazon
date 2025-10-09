import { Controller, UseFilters } from '@nestjs/common';
import {
  AdminProfileResponseDto,
  ProfileResponseDto,
  SignUpDto,
  UpdateProfileDto,
  UserOrderInfoResponseDto,
} from '@app/common';
import { ProfileExceptionFilter } from '../exception/profile-exception.filter';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileEntity } from '../entity/profile.identity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfileCommand } from '../commands/create-profile/create-profile.command';
import { GetUserProfileQuery } from '../queries/get-user-profile/get-user-profile.query';
import { GetAllUserProfilesQuery } from '../queries/get-all-user-profiles/get-all-user-profiles.query';
import { UpdateProfileCommand } from '../commands/update-profile/update-profile.command';
import { UploadAvatarCommand } from '../commands/upload-avatar/upload-avatar.command';
import { GetUserOrderInfoQuery } from '../queries/get-user-order-info/get-user-order-info.query';

@Controller()
@UseFilters(ProfileExceptionFilter)
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'get_all_user_profiles' })
  async getAllUserProfiles(): Promise<AdminProfileResponseDto[]> {
    return this.queryBus.execute(new GetAllUserProfilesQuery());
  }

  @MessagePattern({ cmd: 'get_user_profile' })
  async getUserProfile(payload: { userId: number }): Promise<ProfileResponseDto> {
    return this.queryBus.execute(new GetUserProfileQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'get_user_order_info' })
  async getUserOrderInfo(payload: { userId: number }): Promise<UserOrderInfoResponseDto> {
    return this.queryBus.execute(new GetUserOrderInfoQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'create_profile' })
  async createProfile(payload: { userId: number; signUpDto: SignUpDto }): Promise<ProfileResponseDto> {
    return this.commandBus.execute(new CreateProfileCommand(payload.userId, payload.signUpDto));
  }

  @MessagePattern({ cmd: 'update_user_profile' })
  async updateProfile(payload: { userId: number; updateProfileDto: UpdateProfileDto }): Promise<ProfileResponseDto> {
    return this.commandBus.execute(new UpdateProfileCommand(payload.userId, payload.updateProfileDto));
  }

  @MessagePattern({ cmd: 'upload_user_avatar' })
  async uploadUserAvatar(payload: { userId: number; avatarPayload: any }): Promise<string> {
    return this.commandBus.execute(new UploadAvatarCommand(payload.userId, payload.avatarPayload));
  }
}
