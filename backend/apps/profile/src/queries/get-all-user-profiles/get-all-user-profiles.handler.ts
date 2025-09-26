import { AdminProfileResponseDto, ErrorCode, SERVICE_NAMES } from '@app/common';
import { GetAllUserProfilesQuery } from './get-all-user-profiles.query';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {RepositoryService} from "@repository/repository.service";
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@QueryHandler(GetAllUserProfilesQuery)
export class GetAllUserProfilesHandler implements IQueryHandler<GetAllUserProfilesQuery> {
  constructor(
    @Inject(SERVICE_NAMES.IDENTITY)
    private readonly identityClient: ClientProxy,
    private readonly repository: RepositoryService,
  ) {}

  async execute(): Promise<AdminProfileResponseDto[]> {
    const profiles = await this.repository.profile.findAll();

    const userIds = profiles.map((profile) => profile.userId);

    let identities = {};
    try {
      identities = await firstValueFrom(this.identityClient.send({ cmd: 'get_users_identity' }, { userIds }));
    } catch (error) {
      console.error(error);
      throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
    }

    return profiles.map((profile) => {
      const dto = plainToInstance(AdminProfileResponseDto, profile, {
        excludeExtraneousValues: true,
      });
      dto.email = identities[profile.userId]?.email;
      return dto;
    });
  }
}
