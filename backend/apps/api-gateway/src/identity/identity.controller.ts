import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AuthResponseDto, SERVICE_NAMES, SignInDto, SignUpDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';
import { Public } from '../common/decorators/public.decorator';
import { Response } from '../common/interceptors/transform/transform.interceptor';

@Controller('auth')
@Public()
export class IdentityController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) protected client: ClientProxy) {
    super(client);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'sign_up' }, signUpDto);
    return {
      message: 'Register successfully!',
      success: true,
      data: result,
    };
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'sign_in' }, signInDto);
    return {
      message: 'Login successfully!',
      success: true,
      data: result,
    };
  }
}
