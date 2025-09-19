import { SignOutCommand } from './sign-out.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode, RedisHelper } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async execute(command: SignOutCommand): Promise<string> {
    const { accessToken } = command;

    let payload: any;
    try {
      payload = this.jwtService.verify(accessToken);
    } catch (e) {
      throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
    }

    const redisKey = `access:${payload.sub}`;

    const now = Math.floor(Date.now() / 1000);
    const ttl = payload.exp - now;

    await this.redisHelper.set(redisKey, payload.tokenId, ttl);
    await this.redisHelper.del(`refresh:${payload.sub}`);

    return 'Sign out successfully';
  }
}
