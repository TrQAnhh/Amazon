import { Controller, Get } from '@nestjs/common';
import { IdentityService } from '../service/identity.service';
import {
    AuthResponse,
    IdentityServiceController,
    IdentityServiceControllerMethods,
    SignInDto,
    SignUpDto
} from "@app/common";

@Controller()
@IdentityServiceControllerMethods()
export class IdentityController implements IdentityServiceController {
    constructor(private readonly identityService: IdentityService) {}

    signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
        return this.identityService.signUp(signUpDto);
    }
    signIn(signInDto: SignInDto): Promise<AuthResponse> {
        return this.identityService.signIn(signInDto);
    }
}
