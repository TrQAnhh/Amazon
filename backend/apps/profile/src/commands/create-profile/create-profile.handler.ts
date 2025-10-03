import { RepositoryService } from '@repository/repository.service';
import { CreateProfileCommand } from './create-profile.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, ProfileResponseDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(payload: CreateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, signUpDto } = payload;

    const existingProfile = await this.repository.profile.findByUserId(userId);

    if (existingProfile) {
      throw new RpcException(ErrorCode.USER_PROFILE_EXISTED);
    }

    const { firstName, lastName, middleName } = signUpDto;

    const profile = this.repository.profile.create({
      userId,
      firstName,
      middleName,
      lastName,
    });

    const savedProfile = await this.repository.profile.save(profile);

    return plainToInstance(ProfileResponseDto, savedProfile, {
      excludeExtraneousValues: true,
    });
  }
}
