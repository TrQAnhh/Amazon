import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { SERVICE_NAMES } from '@app/common/constants/service-names';
import { Strategy } from 'passport-custom';
import {ErrorCode} from "@app/common/constants/error-code";
import {AppException} from "../exception/app.exception";

@Injectable()
export class IdentityStrategy extends PassportStrategy(Strategy, 'identity') {
    constructor(@Inject(SERVICE_NAMES.IDENTITY) private client: ClientProxy) {
        super();
    }

    async validate(req: any) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new AppException(ErrorCode.UNAUTHENTICATED);

        const token = authHeader.split(' ')[1];
        const result = await firstValueFrom(this.client.send({ cmd: 'validate_token' }, token));

        if (!result.valid) throw new AppException(ErrorCode.UNAUTHORIZED);

        return { userId: result.userId, role: result.role };
    }
}
