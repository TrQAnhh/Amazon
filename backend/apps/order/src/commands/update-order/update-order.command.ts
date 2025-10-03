import { UpdateOrderDto } from '@app/common';

export class UpdateOrderCommand {
  constructor(
    public readonly role: string,
    public readonly userId: number,
    public readonly orderId: number,
    public readonly updateOrderDto: UpdateOrderDto,
  ) {}
}
