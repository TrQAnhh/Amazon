/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  Inject,
} from '@nestjs/common';
import { IdentityService } from './identity.service';
import { SignUpDto } from '@app/common/dto/identity/sign-up.dto';
import { SignInDto } from '@app/common/dto/identity/sign-in.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthResponseDto } from '@app/common/dto/identity/auth-response.dto';
import { SERVICE_NAMES } from '../common/constants/service-names';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class IdentityController {
  constructor(
    private readonly identityService: IdentityService,
    @Inject(SERVICE_NAMES.IDENTITY) private client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      const response = await firstValueFrom(
        this.client.send({ cmd: 'signUp' }, signUpDto),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    } catch (error: any) {
      console.log('signUp', error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new HttpException(error, error?.errorStatus);
    }
  }

  // @Post('sign-in')
  // signIn(@Body() signInDto: SignInDto): Observable<AuthResponseDto> {
  //   return this.identityService.signIn(signInDto);
  // }
}
