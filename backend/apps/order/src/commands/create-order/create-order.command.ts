import { CreateOrderDto } from '@app/common';

export class CreateOrderCommand {
  constructor(
    public readonly role: string,
    public readonly userId: number,
    public readonly createOrderDto: CreateOrderDto,
  ) {}
}
