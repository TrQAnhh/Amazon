import { RefreshTokenCommand } from './refresh-token.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto, ErrorCode, RedisHelper } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<AuthResponseDto> {
    const { refreshToken } = command;

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
    }

    const redisKey = `refresh:${payload.sub}`;
    const savedTokenId = await this.redisHelper.get(redisKey);

    if (!savedTokenId || savedTokenId !== payload.tokenId) {
      throw new RpcException(ErrorCode.INVALID_JWT_TOKEN);
    }

    const newPayload = {
      sub: payload.sub,
      role: payload.role,
      tokenId: uuidv4(),
    };

    const accessToken = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });

    await this.redisHelper.set(redisKey, newPayload.tokenId, Number(process.env.JWT_REFRESH_TOKEN_DURATION));

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
