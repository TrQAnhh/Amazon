import { ErrorCode, OrderStatus, PaymentStatus, UserRole } from '@app/common';
import { OrderEntity } from '../entity/order.entity';
import { RpcException } from '@nestjs/microservices';

export function validateOrder(order: OrderEntity, userId: number, role: string) {
  if (!order) {
    throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
  }
  if (role !== UserRole.ADMIN && order.userId !== userId) {
    throw new RpcException(ErrorCode.UNAUTHORIZED);
  }
  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new RpcException(ErrorCode.ORDER_ALREADY_PAID);
  }
  if (order.paymentStatus === PaymentStatus.PROCESSING) {
    throw new RpcException(ErrorCode.ORDER_PROCESSING);
  }
  if (order.paymentStatus === PaymentStatus.FAILED) {
    throw new RpcException(ErrorCode.ORDER_ALREADY_FAILED);
  }
  if (order.status === OrderStatus.CANCELED) {
    throw new RpcException(ErrorCode.ORDER_ALREADY_CANCELED);
  }
}
