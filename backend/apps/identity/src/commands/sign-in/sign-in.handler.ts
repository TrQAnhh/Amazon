import {
    AuthResponseDto,
    ErrorCode,
    RedisHelper,
    RepositoryService,
    SERVICE_NAMES
} from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { getUserProfile } from '../../helpers/get-profile.helper';
import { Inject } from '@nestjs/common';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @Inject(SERVICE_NAMES.PROFILE)
    private readonly profileClient: ClientProxy,
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

    const success = await bcrypt.compare(signInDto.password, userByEmail.password);

    if (!success) {
      throw new RpcException(ErrorCode.INVALID_CREDENTIALS);
    }

    const profile = await getUserProfile(this.profileClient, userByEmail.id);

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
    await this.redisHelper.set(redisKey, payload.tokenId, Number(process.env.JWT_REFRESH_TOKEN_DURATION));

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: userByEmail.role,
      user: profile,
    };
  }
}
