import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { assertExists, ErrorCode, ProfileResponseDto, SERVICE_NAMES } from '@app/common';
import { UpdateProfileCommand } from './update-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { getUserIdentity } from '../../helpers/get-identity.helper';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, updateProfileDto } = command;

    const existingProfile = await assertExists<ProfileEntity>(this.profileRepo, { userId }, ErrorCode.PROFILE_NOT_FOUND);

    const updated = this.profileRepo.merge(existingProfile, updateProfileDto);
    const profile = await this.profileRepo.save(updated);

    const { email } = await getUserIdentity(this.identityClient, userId);

    return {
      ...profile,
      email,
    };
  }
}
