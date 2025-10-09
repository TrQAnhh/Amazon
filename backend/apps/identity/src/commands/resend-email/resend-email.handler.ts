import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResendEmailCommand } from "./resend-email.command";
import { EmailService, ErrorCode, RedisHelper, SERVICE_NAMES } from "@app/common";
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { RepositoryService } from "@repository/repository.service";
import { getUserProfile } from "../../helpers/get-profile.helper";
import { Inject } from "@nestjs/common";
import ms from 'ms';

@CommandHandler(ResendEmailCommand)
export class ResendEmailHandler implements ICommandHandler<ResendEmailCommand> {
    constructor(
        @Inject(SERVICE_NAMES.PROFILE)
        private readonly profileClient: ClientProxy,
        public readonly emailService: EmailService,
        private readonly redisHelper: RedisHelper,
        private readonly repository: RepositoryService,
    ) {}

    async execute(command: ResendEmailCommand): Promise<string> {
        const { resendEmailDto } = command;

        const limitKey = `resend_email:${resendEmailDto.email}`;
        const limitEmail = await this.redisHelper.get(limitKey);

        if (limitEmail) {
            throw new RpcException(ErrorCode.TOO_MANY_REQUESTS);
        }

        const userByEmail = await this.repository.identity.findByEmail(resendEmailDto.email);

        if (!userByEmail) {
            throw new RpcException(ErrorCode.USER_NOT_FOUND);
        }

        if (userByEmail.isVerified) {
            throw new RpcException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        if (userByEmail.lastEmailSentAt) {
            const timeSinceLastSent = Date.now() - new Date(userByEmail.lastEmailSentAt).getTime();
            const remainTime = ms(process.env.LONG_RATE_LIMIT_TTL) - timeSinceLastSent;

            if (remainTime > 0) {
                throw new RpcException(ErrorCode.TOO_MANY_REQUESTS);
            }
        }

        const tokenId = uuidv4();

        const profile = await getUserProfile(this.profileClient,userByEmail.id);
        await this.emailService.sendEmail(userByEmail.email, profile.firstName, profile.lastName, tokenId);

        const redisKey = `verify-email:${tokenId}`;
        await this.redisHelper.set(redisKey, userByEmail.id, ms(process.env.VERIFY_EMAIL_TOKEN_DURATION));
        await this.redisHelper.set(limitKey, '1', ms(process.env.SHORT_RATE_LIMIT_TTL));

        await this.repository.identity.update(userByEmail.id,{ lastEmailSentAt: new Date()});

        return 'Please check your email to verify your account';
    }
}