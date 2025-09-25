import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto, OrderResponseDto } from '@app/common';
import { CreateOrderCommand } from '../commands/create-order/create-order.command';
import { GetAllOrdersQuery } from "../queries/get-all-orders/get-all-orders.query";
import { GetOrderQuery } from "../queries/get-order/get-order.query";
import {CheckOutCommand} from "../commands/check-out/check-out.command";
import {CancelOrderCommand} from "../commands/cancel-order/cancel-order.command";

@Controller()
export class OrderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(payload: { role: string, userId: number; createOrderDto: CreateOrderDto }): Promise<string | null> {
    return this.commandBus.execute(new CreateOrderCommand(payload.role, payload.userId, payload.createOrderDto));
  }

  @MessagePattern({ cmd: 'get_all_user_orders'})
  async getAllUserOrders(payload: { userId: number }): Promise<OrderResponseDto[]> {
      return this.queryBus.execute(new GetAllOrdersQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'get_order_details' })
  async getOrderDetails(payload: { orderId: number, userId: number, role: string }): Promise<OrderResponseDto> {
      return this.queryBus.execute(new GetOrderQuery(payload.role, payload.userId,payload.orderId));
  }

  @MessagePattern({ cmd: 'check_out' })
  async checkout(payload: { orderId: number, userId: number, role: string }): Promise<string> {
      return this.commandBus.execute(new CheckOutCommand(payload.role, payload.userId,payload.orderId));
  }

  @MessagePattern({ cmd: 'cancel_order' })
  async cancelOrder(payload: { orderId: number, userId: number, role: string }): Promise<string> {
      return this.commandBus.execute(new CancelOrderCommand(payload.role, payload.userId,payload.orderId));
  }
}
