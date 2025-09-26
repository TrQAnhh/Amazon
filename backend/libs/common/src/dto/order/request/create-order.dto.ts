import { PaymentMethod } from "../../../constants/payment-method.enum";

export class CreateOrderDto {
  paymentMethod: PaymentMethod;
  items: {
    productId: number;
    quantity: number;
  }[];
}
