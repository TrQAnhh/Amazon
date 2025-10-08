import { UserRegisteredEvent } from './user-registered.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {EmailService, ErrorCode, RedisHelper} from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import {RpcException} from "@nestjs/microservices";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    const { userId, firstName, lastName, email } = event;

    const tokenId = uuidv4();

    await this.redisHelper.set(`${tokenId}`, userId, Number(process.env.VERIFY_EMAIL_TOKEN_DURATION));

    try {
        await this.emailService.sendEmail(email, firstName, lastName, tokenId);
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw new RpcException(ErrorCode.EMAIL_SEND_FAILED);
    }
  }
}
