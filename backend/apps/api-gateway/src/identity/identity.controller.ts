import { AuthResponseDto, RefreshTokenDto, SERVICE_NAMES, SignInDto, SignUpDto } from '@app/common';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { Controller, Post, Body, Inject, Req } from '@nestjs/common';
import { BaseController } from '../common/base/base.controller';
import { Public } from '../common/decorators/public.decorator';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Identity service')
@Controller('auth')
export class IdentityController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) protected client: ClientProxy) {
    super(client);
  }

  @Public()
  @Post('sign-up')
  @ApiCreatedResponse({ description: 'Created user object as response', type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email has already been registered' })
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
  @ApiOkResponse({ description: 'Login successfully', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async signIn(@Body() signInDto: SignInDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'sign_in' }, signInDto);
    return {
      message: 'Login successfully!',
      success: true,
      data: result,
    };
  }

  @Post('sign-out')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Sign out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated access' })
  async signOut(@Req() request: any): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'sign_out' }, request.user);
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Public()
  @Post('/refresh-token')
  @ApiOkResponse({ description: 'Request a new access token successfully', type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired JWT token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<Response<AuthResponseDto>> {
    const result = await this.sendCommand<AuthResponseDto>({ cmd: 'refresh_token' }, refreshTokenDto);
    return {
      message: 'Request a new access token successfully',
      success: true,
      data: result,
    };
  }
}
