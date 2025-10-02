import { PaymentMethod } from "@app/common/constants";
import {ApiProperty} from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    type: 'array',
    items: {
        type: 'object',
        properties: {
            productId: { type: 'number' },
            quantity: { type: 'number' },
        },
        required: ['productId', 'quantity'],
    },
  })
  items: {
    productId: number;
    quantity: number;
  }[];

  @ApiProperty({ type: 'number', required: false })
  freeshipId?: number;

  @ApiProperty({ type: 'number', required: false })
  discountId?: number;
}
