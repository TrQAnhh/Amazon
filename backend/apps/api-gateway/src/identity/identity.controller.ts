import { AuthResponseDto, RefreshTokenDto, SERVICE_NAMES, SignInDto, SignUpDto } from '@app/common';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import {Controller, Post, Body, Inject, Req, Get} from '@nestjs/common';
import { BaseController } from '../common/base/base.controller';
import { Public } from '../common/decorators/public.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { Query } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Identity service')
@Controller('auth')
export class IdentityController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.IDENTITY) protected client: ClientProxy) {
    super(client);
  }

  @Public()
  @Post('sign-up')
  @ApiCreatedResponse({ description: 'Please check your email to verify your account' })
  @ApiConflictResponse({ description: 'Email has already been registered' })
  @ApiForbiddenResponse({ description: 'Email has not been verified. Please check your inbox to verify your account' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<Response<any>> {
    const message = await this.sendCommand<string>({ cmd: 'sign_up' }, signUpDto);
    return {
      message,
      success: true,
      data: null,
    };
  }


    @Public()
    @Get('verify-email')
    @ApiOkResponse({ description: 'Email verified successfully', type: AuthResponseDto })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired verification token' })
    async verifyEmail(
        @Query('tokenId') tokenId: string,
    ): Promise<Response<AuthResponseDto>> {
        const result = await this.sendCommand<AuthResponseDto>({ cmd: 'verify_email' }, { tokenId });
        return {
            message: 'Email verified successfully',
            success: true,
            data: result,
        };
    }

  @Public()
  @Post('sign-in')
  @ApiOkResponse({ description: 'Login successfully', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiForbiddenResponse({ description: 'Email has been registered and not verified. Please check your inbox to verify your account. Please check your inbox to verify your account' })
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
