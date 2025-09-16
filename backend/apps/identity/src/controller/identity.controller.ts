import { Controller, UseFilters } from '@nestjs/common';
import { IdentityService } from '../service/identity.service';
import { MessagePattern } from '@nestjs/microservices';
import { IdentityExceptionFilter } from '../exception/identity-exception.filter';
import { SignUpDto } from '@app/common/dto/identity/sign-up.dto';
import { AuthResponseDto } from '@app/common/dto/identity/auth-response.dto';
import { SignInDto } from '@app/common/dto/identity/sign-in.dto';

@Controller()
@UseFilters(IdentityExceptionFilter)
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern({ cmd: 'sign_up' })
  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.identityService.signUp(signUpDto);
  }

  @MessagePattern({ cmd: 'sign_in' })
  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.identityService.signIn(signInDto);
  }
}
