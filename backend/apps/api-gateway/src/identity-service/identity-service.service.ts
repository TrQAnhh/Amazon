import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {IdentityServiceClient, SignInDto, SignUpDto} from "@libs/common";
import {IDENTITY_SERVICE} from "./common/constants";
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class IdentityServiceService implements OnModuleInit {
    private identityServiceClient: IdentityServiceClient;

    constructor(@Inject(IDENTITY_SERVICE) private client: ClientGrpc) {
    }

    onModuleInit(): void {
        this.identityServiceClient = this.client.getService<IdentityServiceClient>('IdentityService');

    }

    signUp(signUpDto: SignUpDto) {
        return this.identityServiceClient.signUp(signUpDto);
    }

    signIn(signInDto: SignInDto) {
        return this.identityServiceClient.signIn(signInDto);
    }

}
