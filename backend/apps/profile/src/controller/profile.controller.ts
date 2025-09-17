import {Controller, Get, Req, UseFilters} from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import {ProfileExceptionFilter} from "../exception/profile-exception.filter";
import {MessagePattern} from "@nestjs/microservices";
import {SignUpDto} from "@app/common/dto/identity/request/sign-up.dto";
import {UpdateProfileDto} from "@app/common/dto/profile/request/update-profile.dto";
import {parseUri} from "@grpc/grpc-js/build/src/uri-parser";

@Controller()
@UseFilters(ProfileExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: 'get_user_profile' })
  async getUserProfile(payload: { userId: number }) {
      return this.profileService.getUserProfile(payload.userId);
  }

  @MessagePattern({ cmd: 'create_profile'})
  async createProfile(payload: { userId: number, signUpDto: SignUpDto }): Promise<any> {
      return this.profileService.createProfile(payload.userId, payload.signUpDto);
  }

  @MessagePattern({ cmd: 'update_user_profile'})
  async updateProfile(payload: {
      userId: number,
      updateProfileDto: UpdateProfileDto,
      avatarPayload?: any,
  }): Promise<any> {
      return this.profileService.updateProfile(payload.userId, payload.updateProfileDto, payload.avatarPayload);
  }
}
