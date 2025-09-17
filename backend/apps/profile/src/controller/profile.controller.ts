import { Controller, UseFilters } from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import { ProfileExceptionFilter } from "../exception/profile-exception.filter";
import { MessagePattern } from "@nestjs/microservices";
import { SignUpDto } from "@app/common/dto/identity/request/sign-up.dto";
import { UpdateProfileDto } from "@app/common/dto/profile/request/update-profile.dto";
import { ProfileEntity } from "../entity/profile.identity";
import { ProfileResponseDto } from "@app/common/dto/profile/response/profile-response.dto";

@Controller()
@UseFilters(ProfileExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: 'get_all_user_profiles' })
  async getAllUserProfiles(): Promise<ProfileResponseDto[]> {
      return this.profileService.getAllUserProfiles();
  }

  @MessagePattern({ cmd: 'get_user_profile' })
  async getUserProfile(payload: { userId: number }): Promise<ProfileResponseDto> {
      return this.profileService.getUserProfile(payload.userId);
  }

  @MessagePattern({ cmd: 'create_profile'})
  async createProfile(payload: { userId: number, signUpDto: SignUpDto }): Promise<ProfileEntity> {
      return this.profileService.createProfile(payload.userId, payload.signUpDto);
  }

  @MessagePattern({ cmd: 'update_user_profile'})
  async updateProfile(payload: {
      userId: number,
      updateProfileDto: UpdateProfileDto,
      avatarPayload?: any,
  }): Promise<ProfileResponseDto> {
      return this.profileService.updateProfile(payload.userId, payload.updateProfileDto, payload.avatarPayload);
  }
}
