import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserProfileQuery } from "./get-user-profile.query";
import {ErrorCode, ProfileResponseDto, SERVICE_NAMES} from "@app/common";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {InjectRepository} from "@nestjs/typeorm";
import {ProfileEntity} from "../../entity/profile.identity";
import {Repository} from "typeorm";
import {Inject} from "@nestjs/common";

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {

    constructor(
       @InjectRepository(ProfileEntity)
       private readonly profileRepo: Repository<ProfileEntity>,
       @Inject(SERVICE_NAMES.IDENTITY) private readonly identityClient: ClientProxy
    ) {}

    async execute(query: GetUserProfileQuery): Promise<ProfileResponseDto> {
        const existingProfile = await this.profileRepo.findOne({
            where: {
                userId: query.userId,
            },
        });

        if (!existingProfile) {
            throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
        }

        let email: string;
        try {
            const identity = await firstValueFrom(this.identityClient.send({ cmd: 'get_user_identity' }, { userId: query.userId }));
            email = identity.email;
        } catch (error) {
            console.error(`[ERROR] `,error);
            throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
        }

        return {
            email: email,
            ...existingProfile,
        };
    }
}