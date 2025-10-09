import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@app/common/constants';

export class UpdateOrderDto {
  @ApiProperty({ enum: PaymentMethod, required: false })
  paymentMethod?: string;
}
