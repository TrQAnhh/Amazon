import {ErrorCode, IdentityResponseDto, RepositoryService} from '@app/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserIdentitiesQuery } from './get-user-identities.query';
import { RpcException } from '@nestjs/microservices';

@QueryHandler(GetUserIdentitiesQuery)
export class GetUserIdentitiesHandler implements IQueryHandler<GetUserIdentitiesQuery> {
  constructor(
    private readonly repository: RepositoryService,
  ) {}

  async execute(query: GetUserIdentitiesQuery): Promise<Record<number, IdentityResponseDto>> {
    if (!query.userIds || query.userIds.length === 0) {
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    const users = await this.repository.identity.findByIds(query.userIds);

    const result: Record<number, IdentityResponseDto> = {};
    users.forEach((user) => (result[user.id] = { email: user.email }));

    return result;
  }
}
