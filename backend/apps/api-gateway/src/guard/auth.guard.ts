import {CanActivate, ExecutionContext, Inject, Injectable} from "@nestjs/common";
import {firstValueFrom, Observable} from "rxjs";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {ErrorCode} from "@app/common/constants/error-code";
import {SERVICE_NAMES} from "@app/common/constants/service-names";
import {AppException} from "../exception/app.exception";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(@Inject(SERVICE_NAMES.IDENTITY) private client: ClientProxy) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if(!authHeader){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        const token = authHeader.split(' ')[1];

        const result = await firstValueFrom(this.client.send({ cmd: 'validate_token' }, token));

        if(!result.valid) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        request.user = { userId: result.userId, role: result.role };

        return true;
    }
}