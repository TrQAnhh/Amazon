import {Controller, Get, UseFilters} from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import {ProfileExceptionFilter} from "../exception/profile-exception.filter";
import {MessagePattern} from "@nestjs/microservices";
import {SignUpDto} from "@app/common/dto/identity/sign-up.dto";
import {UpdateProfileDto} from "@app/common/dto/profile/update-profile.dto";

@Controller()
@UseFilters(ProfileExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: 'create_profile'})
  async createProfile(payload: { userId: number; signUpDto: SignUpDto; }): Promise<any> {
      return this.profileService.createProfile(payload.userId, payload.signUpDto);
  }

  @MessagePattern({ cmd: 'update_profile'})
  async updateProfile(payload: { userId: number; updateProfileDto: UpdateProfileDto; }): Promise<any> {
      return this.profileService.updateProfile(payload.userId, payload.updateProfileDto);
  }
}
