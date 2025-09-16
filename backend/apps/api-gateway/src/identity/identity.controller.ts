import { Controller, Post, Body, Inject } from '@nestjs/common';
import { SignUpDto } from '@app/common/dto/identity/sign-up.dto';
import { SignInDto } from '@app/common/dto/identity/sign-in.dto';
import { AuthResponseDto } from '@app/common/dto/identity/auth-response.dto';
import { SERVICE_NAMES } from '../common/constants/service-names';
import { ClientProxy } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';

@Controller('auth')
export class IdentityController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) protected client: ClientProxy) {
    super(client);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return await this.sendCommand<AuthResponseDto>({ cmd: 'signUp' }, signUpDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return await this.sendCommand<AuthResponseDto>({ cmd: 'signIn' }, signInDto);
  }
}
