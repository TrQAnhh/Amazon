import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto, OrderResponseDto } from '@app/common';
import { CreateOrderCommand } from '../commands/create-order/create-order.command';
import { GetAllOrdersQuery } from "../queries/get-all-orders/get-all-orders.query";
import { GetOrderQuery } from "../queries/get-order/get-order.query";

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

  @MessagePattern({ cmd: 'get_all_user_orders'})
  async getAllUserOrders(payload: { userId: number }): Promise<OrderResponseDto[]> {
      return this.queryBus.execute(new GetAllOrdersQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'get_order_details' })
  async getOrderDetails(payload: { orderId: number }): Promise<OrderResponseDto> {
      return this.queryBus.execute(new GetOrderQuery(payload.orderId));
  }
}
