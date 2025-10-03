import { ErrorCode, SERVICE_NAMES, UserOrderInfoResponseDto } from '@app/common';
import { GetUserOrderInfoQuery } from './get-user-order-info.query';
import { getUserIdentity } from '../../helpers/get-identity.helper';
import { RepositoryService } from '@repository/repository.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { Inject } from '@nestjs/common';

@QueryHandler(GetUserOrderInfoQuery)
export class GetUserOrderInfoHandler implements IQueryHandler<GetUserOrderInfoQuery> {
  constructor(
    @Inject(SERVICE_NAMES.IDENTITY)
    private readonly identityClient: ClientProxy,
    private readonly repository: RepositoryService,
  ) {}

  async execute(query: GetUserOrderInfoQuery): Promise<UserOrderInfoResponseDto> {
    const { userId } = query;

    const profile = await this.repository.profile.findByUserId(userId);

    if (!profile) {
      throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
    }

    const { email } = await getUserIdentity(this.identityClient, userId);

    const profileDto = plainToInstance(UserOrderInfoResponseDto, profile, {
      excludeExtraneousValues: true,
    });

    profileDto.email = email;
    return profileDto;
  }
}
