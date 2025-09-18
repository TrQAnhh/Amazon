import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {GetAllUserProfilesQuery } from "./get-all-user-profiles.query";
import { ProfileEntity } from "../../entity/profile.identity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject } from "@nestjs/common";
import { ErrorCode, ProfileResponseDto, SERVICE_NAMES } from "@app/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@QueryHandler(GetAllUserProfilesQuery)
export class GetAllUserProfilesHandler implements IQueryHandler<GetAllUserProfilesQuery> {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepo: Repository<ProfileEntity>,
        @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy,
    ) {}

    async execute(): Promise<ProfileResponseDto[]>{
       const profiles = await this.profileRepo.find();
       const userIds = profiles.map((profile) => profile.userId);

       let identities = {};
       try {
           identities = await firstValueFrom(this.identityClient.send({ cmd: 'get_users_identity' }, { userIds }));
       } catch (error) {
           console.error(error);
           throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
       }

        return profiles.map((p) => ({
            ...p,
            email: identities[p.userId]?.email,
        }));
    }
}