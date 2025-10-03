import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IdentityEntity } from '../identity/src/entity/identity.entity';

@Injectable()
export class IdentityRepository {
  constructor(
    @InjectRepository(IdentityEntity)
    public readonly repo: Repository<IdentityEntity>,
  ) {}

  async findById(id: number): Promise<IdentityEntity | null> {
    return await this.repo.findOneBy({ id });
  }

  async findByIds(userIds: number[]): Promise<IdentityEntity[]> {
    return this.repo.find({ where: { id: In(userIds) } });
  }

  async findByEmail(email: string): Promise<IdentityEntity | null> {
    return await this.repo.findOneBy({ email });
  }

  create(data: Partial<IdentityEntity>): IdentityEntity {
    return this.repo.create(data);
  }

  async save(user: IdentityEntity): Promise<IdentityEntity> {
    return this.repo.save(user);
  }
}
