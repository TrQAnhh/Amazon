import { UserRegisteredEvent } from '../../event/user-registered.event';
import { RepositoryService } from '@repository/repository.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorCode, SERVICE_NAMES } from '@app/common';
import { SignUpCommand } from './sign-up.command';
import { EventBus } from '@nestjs/cqrs';
import { firstValueFrom } from "rxjs";
import { Inject } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import {sign} from "node:crypto";

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @Inject(SERVICE_NAMES.PROFILE)
    private readonly profileClient: ClientProxy,
    private readonly repository: RepositoryService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SignUpCommand): Promise<string> {
    const { signUpDto } = command;

    const existingUser = await this.repository.identity.findByEmail(signUpDto.email);

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new RpcException(ErrorCode.EMAIL_EXISTED);
      } else {
        throw new RpcException(ErrorCode.EMAIL_NOT_VERIFIED);
      }
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const user = this.repository.identity.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const savedUser = await this.repository.identity.save(user);

    await firstValueFrom(this.profileClient.send({ cmd: 'create_profile' }, { userId: savedUser.id, signUpDto }));

    this.eventBus.publish(new UserRegisteredEvent(savedUser.id,signUpDto.firstName, signUpDto.lastName, savedUser.email));

    return 'Please check your email to verify your account';
  }
}