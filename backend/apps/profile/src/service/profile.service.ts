import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProfileEntity} from "../entity/profile.identity";
import {Repository} from "typeorm";
import {RpcException} from "@nestjs/microservices";
import {ErrorCode} from "@app/common/constants/error-code";
import {SignUpDto} from "@app/common/dto/identity/sign-up.dto";
import {UpdateProfileDto} from "@app/common/dto/profile/update-profile.dto";

@Injectable()
export class ProfileService {
  constructor(
      @InjectRepository(ProfileEntity)
      private readonly profileRepo: Repository<ProfileEntity>,
  ) {}

  async createProfile(userId: number, signUpDto: SignUpDto) {
      const existingProfile = await this.profileRepo.findOne({
          where: {
              userId: userId,
          }
      })

      if (existingProfile) {
          throw new RpcException(ErrorCode.USER_PROFILE_EXISTED);
      }

      const { firstName, lastName, middleName } = signUpDto;

      const profile = this.profileRepo.create({
          userId,
          firstName,
          middleName,
          lastName,
      });

      return this.profileRepo.save(profile);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {

  }
}
