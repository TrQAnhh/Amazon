import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto } from '@app/common';
import { CreateOrderCommand } from '../commands/create-order/create-order.command';

@Controller()
export class OrderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(payload: { userId: number; createOrderDto: CreateOrderDto }): Promise<string> {
    return this.commandBus.execute(new CreateOrderCommand(payload.userId, payload.createOrderDto));
  }
}
