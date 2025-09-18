import { AuthResponseDto, ErrorCode } from '@app/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { IdentityEntity } from '../../entity/identity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(IdentityEntity)
    private readonly identityRepo: Repository<IdentityEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: SignInCommand): Promise<AuthResponseDto> {
    const { signInDto } = command;

    const userByEmail = await this.identityRepo.findOneBy({
      email: signInDto.email,
    });

    if (!userByEmail) {
      throw new RpcException(ErrorCode.USER_NOT_FOUND);
    }

    const success = await bcrypt.compare(signInDto.password, userByEmail.password);
    if (!success) {
      throw new RpcException(ErrorCode.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: userByEmail.id,
      role: userByEmail.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
