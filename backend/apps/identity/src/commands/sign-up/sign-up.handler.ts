import { AuthResponseDto, ErrorCode, SERVICE_NAMES } from '@app/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentityEntity } from '../../entity/identity.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @InjectRepository(IdentityEntity)
    private readonly identityRepo: Repository<IdentityEntity>,
    @Inject(SERVICE_NAMES.PROFILE) private readonly profileClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SignUpCommand): Promise<AuthResponseDto> {
    const { signUpDto } = command;

    const existingUser = await this.identityRepo.findOneBy({
      email: signUpDto.email,
    });

    if (existingUser) {
      throw new RpcException(ErrorCode.EMAIL_EXISTED);
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const user = this.identityRepo.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const savedUser = await this.identityRepo.save(user);

    await firstValueFrom(this.profileClient.send({ cmd: 'create_profile' }, { userId: savedUser.id, signUpDto }));

    const payload = {
      sub: savedUser.id,
      role: savedUser.role,
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
