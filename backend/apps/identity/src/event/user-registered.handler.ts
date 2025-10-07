import { UserRegisteredEvent } from './user-registered.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService, RedisHelper } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const { userId, email } = event;

    const tokenId = uuidv4();

    await this.redisHelper.set(`${tokenId}`, userId, Number(process.env.VERIFY_EMAIL_TOKEN_DURATION));
    await this.emailService.sendEmail(email, tokenId);
  }
}
