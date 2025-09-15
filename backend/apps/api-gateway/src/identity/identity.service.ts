import {BadRequestException, Inject, Injectable, OnModuleInit} from '@nestjs/common';
import type {ClientGrpc} from "@nestjs/microservices";
import {AuthResponse, IDENTITY_SERVICE_NAME, IdentityServiceClient, SignInDto, SignUpDto} from "@app/common";
import {SERVICE_NAMES} from "../common/constants/service-names";
import {Observable} from "rxjs";

@Injectable()
export class IdentityService implements OnModuleInit {
    private identityServiceClient: IdentityServiceClient

    constructor(@Inject(SERVICE_NAMES.IDENTITY) private client: ClientGrpc) {}

    onModuleInit() {
        this.identityServiceClient = this.client.getService<IdentityServiceClient>(IDENTITY_SERVICE_NAME);
    }

    signUp(signUpDto: SignUpDto): Observable<AuthResponse> {
        return this.identityServiceClient.signUp(signUpDto);
    }

    signIn(signInDto: SignInDto): Observable<AuthResponse> {
        return this.identityServiceClient.signIn(signInDto);
    }

}
