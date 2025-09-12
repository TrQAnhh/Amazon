import { Injectable } from '@nestjs/common';
import {AuthResponse, SignInDto, SignUpDto} from "@app/common";
import {InjectRepository} from "@nestjs/typeorm";
import {IdentityEntity} from "../entity/identity.entity";
import {Repository} from "typeorm";

@Injectable()
export class IdentityService {

    constructor(
        @InjectRepository(IdentityEntity)
        private readonly identityRepo: Repository<IdentityEntity>,
    ) {}

    async signIn(signInDto: SignInDto): Promise<AuthResponse> {
        return {
            message: "login successfully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        }
    }

    async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
        return {
            message: "register successfully!",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
        }
    }
}
