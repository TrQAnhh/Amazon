import { Repository, ObjectLiteral, FindOptionsWhere } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common/constants';

export async function assertExists<T extends ObjectLiteral>(
  repo: Repository<T>,
  filter: FindOptionsWhere<T>,
  errorCode: ErrorCode,
): Promise<T> {
  if (!filter) {
    throw new RpcException(ErrorCode.INVALID_INPUT_VALUE);
  }

  const entity = await repo.findOneBy(filter);

  if (!entity) {
    throw new RpcException(errorCode);
  }
  return entity;
}
