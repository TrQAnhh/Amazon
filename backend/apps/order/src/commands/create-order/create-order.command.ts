import { CreateOrderDto } from '@app/common';

export class CreateOrderCommand {
  constructor(
    public readonly userId: number,
    public readonly createOrderDto: CreateOrderDto,
  ) {}
}
