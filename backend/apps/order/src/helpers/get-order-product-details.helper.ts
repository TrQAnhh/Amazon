import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErrorCode, OrderProductDetailDto } from '@app/common';

export async function getOrderProductDetails(
  productClient: ClientProxy,
  productIds: number[],
): Promise<OrderProductDetailDto[]> {
  try {
    return await firstValueFrom(productClient.send({ cmd: 'get_order_product_details' }, { productIds }));
  } catch (err) {
    throw new RpcException(ErrorCode.PRODUCT_SERVICE_UNAVAILABLE);
  }
}
