import { Injectable } from "@nestjs/common";
import { ProfileEntity } from "../profile/src/entity/profile.identity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ProfileRepository {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly repo: Repository<ProfileEntity>
    ) {}

    create(data: Partial<ProfileEntity>): ProfileEntity {
        return this.repo.create(data);
    }

    async findAll(): Promise<ProfileEntity[]> {
        return await this.repo.find();
    }

    async findByUserId(userId: number): Promise<ProfileEntity | null> {
        return await this.repo.findOneBy({ userId });
    }

    async updateByUserId(userId: number, data: Partial<ProfileEntity>): Promise<void> {
        await this.repo.update({ userId }, data);
    }

    merge(entity: ProfileEntity, data: Partial<ProfileEntity>): ProfileEntity {
        return this.repo.merge(entity, data);
    }

    async save(profile: ProfileEntity): Promise<ProfileEntity> {
        return await this.repo.save(profile);
    }
}