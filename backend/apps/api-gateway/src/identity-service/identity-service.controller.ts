import {Controller, Post, Body} from '@nestjs/common';
import type {AuthResponse, SignInDto, SignUpDto} from "@libs/common";
import {IdentityServiceService} from "./identity-service.service";
import {Observable} from "rxjs";

@Controller('identity-service')
export class IdentityServiceController {

  constructor(private readonly identityService: IdentityServiceService) {}

  @Post('register')
  signUp(@Body() signUpDto: SignUpDto): Observable<AuthResponse> {
      return this.identityService.signUp(signUpDto);
  }

  @Post('login')
  signIn(@Body() signInDto: SignInDto): Observable<AuthResponse> {
      return this.identityService.signIn(signInDto);
  }
}
