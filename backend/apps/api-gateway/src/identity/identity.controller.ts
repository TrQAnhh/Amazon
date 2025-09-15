import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors} from '@nestjs/common';
import { IdentityService } from './identity.service';
import {SignUpDto} from "@app/common/dto/identity/sign-up.dto";
import {SignInDto} from "@app/common/dto/identity/sign-in.dto";

@Controller('auth')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
      return this.identityService.signUp(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
      return this.identityService.signIn(signInDto);
  }
}
