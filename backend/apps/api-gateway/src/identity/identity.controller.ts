import { Controller, Post, Body, Inject, UseGuards } from '@nestjs/common';
import { AuthResponseDto, RefreshTokenDto, SERVICE_NAMES, SignInDto, SignOutDto, SignUpDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';
import { Public } from '../common/decorators/public.decorator';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

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

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  async signOut(@Body() signOutDto: SignOutDto): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'sign_out' }, signOutDto);
    return {
      message: message,
      success: true,
      data: null,
    };
  }

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
