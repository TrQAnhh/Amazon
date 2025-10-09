import { UserRegisteredEvent } from './user-registered.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService, ErrorCode, RedisHelper } from '@app/common';
import { v4 as uuidv4 } from 'uuid';
import { RepositoryService } from "@repository/repository.service";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly redisHelper: RedisHelper,
    private readonly emailService: EmailService,
    private readonly repository: RepositoryService,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const { userId, firstName, lastName, email } = event;

    const tokenId = uuidv4();

    const redisKey = `verify-email:${tokenId}`;
    await this.redisHelper.set(redisKey, userId, Number(process.env.VERIFY_EMAIL_TOKEN_DURATION));

    await this.emailService.sendEmail(email, firstName, lastName, tokenId);

    await this.repository.identity.update( userId, {
        lastEmailSentAt: new Date(),
    })
  }
}
