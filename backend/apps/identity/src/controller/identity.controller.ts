import { AuthResponseDto, IdentityResponseDto, SignInDto, SignUpDto } from '@app/common';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IdentityExceptionFilter } from '../exception/identity-exception.filter';
import { GetUserIdentityQuery } from '../queries/get-user-identity/get-user-identity.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserIdentitiesQuery } from '../queries/get-user-identities/get-user-identities.query';
import { SignUpCommand } from '../commands/sign-up/sign-up.command';
import { SignInCommand } from '../commands/sign-in/sign-in.command';
import { ValidateTokenQuery } from '../queries/validate-token/validate-token.query';

@Controller()
@UseFilters(IdentityExceptionFilter)
export class IdentityController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'sign_up' })
  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.commandBus.execute(new SignUpCommand(signUpDto));
  }

  @MessagePattern({ cmd: 'sign_in' })
  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.commandBus.execute(new SignInCommand(signInDto));
  }

  @MessagePattern({ cmd: 'get_user_identity' })
  async getUserIdentity(payload: { userId: number }): Promise<IdentityResponseDto> {
    return this.queryBus.execute(new GetUserIdentityQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'get_users_identity' })
  async getUsersIdentity(payload: { userIds: number[] }): Promise<Record<number, IdentityResponseDto>> {
    return this.queryBus.execute(new GetUserIdentitiesQuery(payload.userIds));
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(token: string): Promise<any> {
    return this.queryBus.execute(new ValidateTokenQuery(token));
  }
}
