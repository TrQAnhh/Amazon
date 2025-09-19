import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, ProfileResponseDto, SERVICE_NAMES, UploadAvatarEvent } from '@app/common';
import { UpdateProfileCommand } from './update-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    private readonly eventBus: EventBus,
    @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, updateProfileDto, avatarPayload } = command;

    const existingProfile = await this.profileRepo.findOne({ where: { userId } });
    if (!existingProfile) {
      throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    const profile = await this.profileRepo.save({
      ...existingProfile,
      ...updateProfileDto,
    });

    if (avatarPayload) {
      this.eventBus.publish(new UploadAvatarEvent(userId, avatarPayload));
    }

    let email: string;
    try {
      const identity = await firstValueFrom(this.identityClient.send({ cmd: 'get_user_identity' }, { userId }));
      email = identity.email;
    } catch (error) {
      console.error(error);
      throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
    }

    return {
      ...profile,
      email,
    };
  }
}
