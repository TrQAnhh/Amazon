import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "../entity/profile.identity";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { ErrorCode } from "@app/common/constants/error-code";
import { SignUpDto } from "@app/common/dto/identity/request/sign-up.dto";
import { UpdateProfileDto } from "@app/common/dto/profile/request/update-profile.dto";
import { CloudinaryService } from "../modules/cloudinary/service/cloudinary.service";
import { Readable } from "node:stream";
import { ProfileResponseDto } from "@app/common/dto/profile/response/profile-response.dto";
import { firstValueFrom } from "rxjs";
import { SERVICE_NAMES } from "@app/common/constants/service-names";

@Injectable()
export class ProfileService {
  constructor(
      @InjectRepository(ProfileEntity)
      private readonly profileRepo: Repository<ProfileEntity>,
      private readonly cloudinaryService: CloudinaryService,
      @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async getAllUserProfiles(): Promise<ProfileResponseDto[]> {
      const profiles = await this.profileRepo.find()
      const userIds = profiles.map(profile => profile.userId);

      const identities = await firstValueFrom(
          this.identityClient.send({ cmd: 'get_users_identity'}, { userIds })
      );

      return  profiles.map(p => ({
          ...p,
          email: identities[p.userId]?.email,
      }));
  }

  async getUserProfile(userId: number): Promise<ProfileResponseDto> {
      const existingProfile = await this.profileRepo.findOne({
          where: {
              userId: userId,
          }
      })

      if (!existingProfile) {
          throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
      }

      const { email } = await firstValueFrom(
          this.identityClient.send({ cmd: 'get_user_identity'},{ userId: userId })
      );

      return {
          email: email,
          ...existingProfile,
      }
  }

  async createProfile(userId: number, signUpDto: SignUpDto): Promise<ProfileEntity> {
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

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto, avatarPayload?: any): Promise<ProfileResponseDto> {
      const existingProfile = await this.getUserProfile(userId);

      let avatarUrl: string | null = null;

      if (avatarPayload) {
          const buffer = Buffer.from(avatarPayload.buffer, 'base64');
          const file: Express.Multer.File = {
              fieldname: 'avatar',
              originalname: avatarPayload.filename,
              encoding: '7bit',
              mimetype: avatarPayload.mimetype,
              buffer,
              size: buffer.length,
              destination: '',
              filename: '',
              path: '',
              stream: Readable.from(buffer)
          };

          avatarUrl = await this.cloudinaryService.uploadImage(file);
      }

      const profile = await this.profileRepo.save({
          ...existingProfile,
          ...updateProfileDto,
          ...(avatarUrl && { avatarUrl }),
      });

      const { email } = await firstValueFrom(this.identityClient.send({ cmd: 'get_user_identity'},{ userId: userId }));

      return {
          ...profile,
          email,
      };
  }
}
