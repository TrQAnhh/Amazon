import { PaymentMethod } from "@app/common/constants";

export class CreateOrderDto {
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    quantity: number;
  }[];
}
