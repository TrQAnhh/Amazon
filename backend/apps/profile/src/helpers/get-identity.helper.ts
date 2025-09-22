import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorCode, IdentityResponseDto } from '@app/common';

export async function getUserIdentity(identityClient: ClientProxy, userId: number): Promise<IdentityResponseDto> {
  try {
    return await firstValueFrom(identityClient.send({ cmd: 'get_user_identity' }, { userId }));
  } catch (err) {
    throw new RpcException(ErrorCode.IDENTITY_SERVICE_UNAVAILABLE);
  }
}
