import { VerifyEmailQuery } from "./verify-email.query";
import { ErrorCode, RedisHelper } from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { RepositoryService } from "@repository/repository.service";
import { ICommandHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(VerifyEmailQuery)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailQuery> {
    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly repository: RepositoryService,
    ) {}

    async execute(query: VerifyEmailQuery): Promise<string> {
        const { tokenId } = query;

        const userId = await this.redisHelper.get(tokenId);

        if (!userId) {
            throw new RpcException(ErrorCode.INVALID_VERIFICATION_TOKEN);
        }

        await this.repository.identity.update(Number(userId), { isVerified: true });
        await this.redisHelper.del(tokenId);

        return 'Email verified successfully, please login';
    }
}