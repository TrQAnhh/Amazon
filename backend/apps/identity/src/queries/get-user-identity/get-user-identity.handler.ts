import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserIdentityQuery } from './get-user-identity.query';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from '../../entity/identity.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { assertExists, ErrorCode, IdentityResponseDto } from '@app/common';

@QueryHandler(GetUserIdentityQuery)
export class GetUserIdentityHandler implements IQueryHandler<GetUserIdentityQuery> {
  constructor(@InjectRepository(IdentityEntity) private readonly identityRepo: Repository<IdentityEntity>) {}

  async execute(query: GetUserIdentityQuery): Promise<IdentityResponseDto> {
    const { id } = query;

    if (id == null) {
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    const user = await assertExists<IdentityEntity>(this.identityRepo, { id }, ErrorCode.USER_NOT_FOUND);

    return { email: user.email };
  }
}
