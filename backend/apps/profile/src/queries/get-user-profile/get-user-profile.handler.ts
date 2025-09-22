import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserProfileQuery } from './get-user-profile.query';
import { assertExists, ErrorCode, ProfileResponseDto, SERVICE_NAMES } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../entity/profile.identity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { getUserIdentity } from '../../helpers/get-identity.helper';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
  ) {}

  async execute(query: GetUserProfileQuery): Promise<ProfileResponseDto> {
    const { userId } = query;

    const existingProfile = await assertExists<ProfileEntity>(
      this.profileRepo,
      { userId },
      ErrorCode.PROFILE_NOT_FOUND,
    );

    const { email } = await getUserIdentity(this.identityClient, userId);

    const profileDto = plainToInstance(ProfileResponseDto, existingProfile, {
      excludeExtraneousValues: true,
    });

    profileDto.email = email;
    return profileDto;
  }
}
