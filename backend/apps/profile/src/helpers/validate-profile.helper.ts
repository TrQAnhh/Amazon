import { ProfileEntity } from '../entity/profile.identity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';

export async function getExistingProfile(repo: Repository<ProfileEntity>, userId: number): Promise<ProfileEntity> {
  const profile = await repo.findOneBy({ userId });
  if (!profile) {
    throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
  }
  return profile;
}
