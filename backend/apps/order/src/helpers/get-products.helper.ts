import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorCode, OrderProductResponseDto } from '@app/common';

export async function getProducts(
  productClient: ClientProxy,
  productIds: number[],
): Promise<OrderProductResponseDto[]> {
  try {
    return await firstValueFrom(productClient.send({ cmd: 'get_order_products' }, { productIds }));
  } catch (err) {
    throw new RpcException(ErrorCode.PRODUCT_SERVICE_UNAVAILABLE);
  }
}
