import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserIdentityQuery } from './get-user-identity.query';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode, IdentityResponseDto } from '@app/common';
import { RepositoryService } from "@repository/repository.service";

@QueryHandler(GetUserIdentityQuery)
export class GetUserIdentityHandler implements IQueryHandler<GetUserIdentityQuery> {
  constructor(
      private readonly repository: RepositoryService,
  ) {}

  async execute(query: GetUserIdentityQuery): Promise<IdentityResponseDto> {
    const { id } = query;

    if (id == null) {
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    const user = await this.repository.identity.findById(id);

    if (!user) {
        throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    return { email: user.email };
  }
}
