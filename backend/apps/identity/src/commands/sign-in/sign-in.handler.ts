import { AuthResponseDto, ErrorCode, RedisHelper, SERVICE_NAMES } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RepositoryService } from '@repository/repository.service';
import ms from 'ms';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    private readonly repository: RepositoryService,
    private readonly jwtService: JwtService,
    private readonly redisHelper: RedisHelper,
  ) {}

  async execute(command: SignInCommand): Promise<AuthResponseDto> {
    const { signInDto } = command;

    const userByEmail = await this.repository.identity.findByEmail(signInDto.email);

    if (!userByEmail) {
      throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    if (!userByEmail.isVerified) {
      throw new RpcException(ErrorCode.EMAIL_NOT_VERIFIED);
    }

    const success = await bcrypt.compare(signInDto.password, userByEmail.password);

    if (!success) {
      throw new RpcException(ErrorCode.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: userByEmail.id,
      role: userByEmail.role,
      tokenId: uuidv4(),
      deviceId: signInDto.deviceId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });

    const redisKey = `refresh:${signInDto.deviceId}`;
    await this.redisHelper.set(redisKey, payload.tokenId, ms(process.env.JWT_REFRESH_TOKEN_DURATION));

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
