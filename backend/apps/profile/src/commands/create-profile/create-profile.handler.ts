import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfileCommand } from './create-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode, ProfileResponseDto } from '@app/common';
import {plainToInstance} from "class-transformer";

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
  ) {}

  async execute(payload: CreateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, signUpDto } = payload;

    const existingProfile = await this.profileRepo.findOneBy({ userId });

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

    const savedProfile = await this.profileRepo.save(profile);

    return plainToInstance(ProfileResponseDto, savedProfile,{
        excludeExtraneousValues: true,
    });
  }
}
