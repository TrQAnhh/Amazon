import { PaymentMethod } from '@app/common';

export class CreateOrderDto {
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    quantity: number;
  }[];
}
