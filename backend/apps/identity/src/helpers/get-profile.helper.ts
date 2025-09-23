import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorCode, ProfileResponseDto } from '@app/common';

export async function getUserProfile(identityClient: ClientProxy, userId: number): Promise<ProfileResponseDto> {
    try {
        return await firstValueFrom(identityClient.send({ cmd: 'get_user_profile' }, { userId }));
    } catch (err) {
        throw new RpcException(ErrorCode.PROFILE_SERVICE_UNAVAILABLE);
    }
}
