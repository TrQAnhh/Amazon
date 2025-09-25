import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, ProfileResponseDto, RepositoryService, SERVICE_NAMES} from '@app/common';
import { UpdateProfileCommand } from './update-profile.command';
import { Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { getUserIdentity } from '../../helpers/get-identity.helper';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject(SERVICE_NAMES.IDENTITY)
    private readonly identityClient: ClientProxy,
    private readonly repository: RepositoryService,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<ProfileResponseDto> {
    const { userId, updateProfileDto } = command;

    const existingProfile = await this.repository.profile.findByUserId(userId);

    if (!existingProfile) {
        throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    const updated = this.repository.profile.merge(existingProfile, updateProfileDto);
    const profile = await this.repository.profile.save(updated);

    const { email } = await getUserIdentity(this.identityClient, userId);

    return {
      ...profile,
      email,
    };
  }
}
