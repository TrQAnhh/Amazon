import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserIdentitiesQuery } from './get-user-identities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from '../../entity/identity.entity';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode, IdentityResponseDto } from '@app/common';

@QueryHandler(GetUserIdentitiesQuery)
export class GetUserIdentitiesHandler implements IQueryHandler<GetUserIdentitiesQuery> {
  constructor(
    @InjectRepository(IdentityEntity)
    private readonly identityRepo: Repository<IdentityEntity>,
  ) {}

  async execute(query: GetUserIdentitiesQuery): Promise<Record<number, IdentityResponseDto>> {
    if (!query.userIds || query.userIds.length === 0) {
      throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
    }

    const users = await this.identityRepo.find({
      where: { id: In(query.userIds) },
    });

    const result: Record<number, IdentityResponseDto> = {};
    users.forEach((user) => (result[user.id] = { email: user.email }));

    return result;
  }
}
