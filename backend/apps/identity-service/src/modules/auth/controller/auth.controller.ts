import {Controller} from "@nestjs/common";
import {
    AuthResponse,
    IdentityServiceController,
    IdentityServiceControllerMethods,
    SignInDto,
    SignUpDto
} from "@libs/common";
import {AuthService} from "../service/auth.service";

@Controller()
@IdentityServiceControllerMethods()
export class AuthController implements IdentityServiceController {

    constructor(private authService: AuthService) {}

    signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
        return this.authService.signUp(signUpDto);
    }
    signIn(signInDto: SignInDto): Promise<AuthResponse> {
        return this.authService.signIn(signInDto);
    }

}