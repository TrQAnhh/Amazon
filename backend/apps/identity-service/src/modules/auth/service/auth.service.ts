import {Injectable} from "@nestjs/common";
import {AuthResponse, SignInDto, SignUpDto} from "@libs/common";

@Injectable()
export class AuthService {

    async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
        return {
            message: "register successufully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        };
    }

    async signIn(signInDto: SignInDto): Promise<AuthResponse> {
        return {
            message: "login successufully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        };
    }
}