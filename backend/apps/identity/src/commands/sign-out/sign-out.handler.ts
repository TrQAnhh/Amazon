import { SignOutCommand } from './sign-out.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, RedisHelper } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(private readonly redisHelper: RedisHelper) {}

  async execute(command: SignOutCommand): Promise<string> {
    const { user } = command;

    const redisKey = `access:${user.deviceId}`;

    const now = Math.floor(Date.now() / 1000);
    const ttl = user.exp - now;

    await this.redisHelper.set(redisKey, user.tokenId, ttl);
    await this.redisHelper.del(`refresh:${user.deviceId}`);
    await this.redisHelper.del(`validated:${user.deviceId}`);

    return 'Sign out successfully';
  }
}
