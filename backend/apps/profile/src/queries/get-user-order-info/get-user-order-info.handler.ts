import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserOrderInfoQuery } from "./get-user-order-info.query";
import { ErrorCode, ProfileResponseDto, RepositoryService, SERVICE_NAMES, UserOrderInfoResponseDto } from "@app/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { getUserIdentity } from "../../helpers/get-identity.helper";
import { Inject } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

@QueryHandler(GetUserOrderInfoQuery)
export class GetUserOrderInfoHandler implements IQueryHandler<GetUserOrderInfoQuery> {
    constructor(
        @Inject(SERVICE_NAMES.IDENTITY)
        private readonly identityClient: ClientProxy,
        private readonly repository: RepositoryService
    ) {}

    async execute(query: GetUserOrderInfoQuery): Promise<UserOrderInfoResponseDto> {
        const { userId } = query;

        const profile = await this.repository.profile.findByUserId(userId);

        if (!profile) {
            throw new RpcException(ErrorCode.PROFILE_NOT_FOUND);
        }

        const { email } = await getUserIdentity(this.identityClient, userId);

        const profileDto = plainToInstance(UserOrderInfoResponseDto, profile,{
            excludeExtraneousValues: true,
        });

        profileDto.email = email;
        return profileDto;
    }
}