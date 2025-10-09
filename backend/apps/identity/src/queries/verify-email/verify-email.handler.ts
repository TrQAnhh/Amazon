import { VerifyEmailQuery } from "./verify-email.query";
import {AuthResponseDto, ErrorCode, RedisHelper} from "@app/common";
import { RpcException } from "@nestjs/microservices";
import { RepositoryService } from "@repository/repository.service";
import { ICommandHandler, QueryHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from "@nestjs/jwt";

@QueryHandler(VerifyEmailQuery)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailQuery> {
    constructor(
        private readonly redisHelper: RedisHelper,
        private readonly jwtService: JwtService,
        private readonly repository: RepositoryService,
    ) {}

    async execute(query: VerifyEmailQuery): Promise<AuthResponseDto> {
        const { email, tokenId } = query;

        const redisKey = `verify-email:${tokenId}`;
        const userId = Number(await this.redisHelper.get(redisKey));

        if (!userId) {
            throw new RpcException({
                code: ErrorCode.INVALID_VERIFICATION_TOKEN.code,
                message: ErrorCode.INVALID_VERIFICATION_TOKEN.message,
                status: ErrorCode.INVALID_VERIFICATION_TOKEN.status,
                addition: { email },
            });
        }

        await this.repository.identity.update( userId , { isVerified: true } );
        await this.redisHelper.del(redisKey);

        const userById = await this.repository.identity.findById(userId);

        const payload = {
            sub: userById!.id,
            role: userById!.role,
            tokenId: uuidv4(),
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}