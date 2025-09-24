import { Controller, Post, Body, Inject, UseGuards, Req } from '@nestjs/common';
import { AuthResponseDto, RefreshTokenDto, SERVICE_NAMES, SignInDto, SignOutDto, SignUpDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class IdentityController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) protected client: ClientProxy) {
    super(client);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'sign_up' }, signUpDto);
    return {
      message: 'Register successfully!',
      success: true,
      data: result,
    };
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'sign_in' }, signInDto);
    return {
      message: 'Login successfully!',
      success: true,
      data: result,
    };
  }

  @Post('sign-out')
  async signOut(@Req() request: any): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'sign_out' }, request.user);
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'refresh_token' }, refreshTokenDto);
    return {
      message: 'Request a new access token successfully!',
      success: true,
      data: result,
    };
  }
}
