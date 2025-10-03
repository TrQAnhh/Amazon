import { ErrorCode, ProfileResponseDto, SERVICE_NAMES } from '@app/common';
import { getUserIdentity } from '../../helpers/get-identity.helper';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RepositoryService } from '@repository/repository.service';
import { GetUserProfileQuery } from './get-user-profile.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Inject } from '@nestjs/common';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
  constructor(
    @Inject(SERVICE_NAMES.IDENTITY)
    private readonly identityClient: ClientProxy,
    private readonly repository: RepositoryService,
  ) {}

  async execute(query: GetUserProfileQuery): Promise<ProfileResponseDto> {
    const { userId } = query;

    const existingProfile = await this.repository.profile.findByUserId(userId);

    if (!existingProfile) {
      throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    const { email } = await getUserIdentity(this.identityClient, userId);

    const profileDto = plainToInstance(ProfileResponseDto, existingProfile, {
      excludeExtraneousValues: true,
    });

    profileDto.email = email;
    return profileDto;
  }
}
