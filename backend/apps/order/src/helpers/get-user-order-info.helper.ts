import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorCode, OrderProductDto } from '@app/common';

export async function getUserOrderInfo(productClient: ClientProxy, userId: number): Promise<OrderProductDto[]> {
  try {
    return await firstValueFrom(productClient.send({ cmd: 'get_user_order_info' }, { userId }));
  } catch (err) {
    throw new RpcException(ErrorCode.PROFILE_SERVICE_UNAVAILABLE);
  }
}
