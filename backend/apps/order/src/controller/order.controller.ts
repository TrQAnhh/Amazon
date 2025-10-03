import {
  CreateOrderDto,
  CreateTicketDto,
  OrderResponseDto,
  TicketDetailResponseDto,
  UpdateOrderDto,
} from '@app/common';
import { GetTicketDetailQuery } from '../queries/get-ticket-detail/get-ticket-detail.query';
import { StripeWebhookCommand } from '../commands/stripe-webhook/stripe-webhook.command';
import { CreateTicketCommand } from '../commands/create-ticket/create-ticket.command';
import { CancelOrderCommand } from '../commands/cancel-order/cancel-order.command';
import { UpdateOrderCommand } from '../commands/update-order/update-order.command';
import { GetAllOrdersQuery } from '../queries/get-all-orders/get-all-orders.query';
import { CreateOrderCommand } from '../commands/create-order/create-order.command';
import { CheckOutCommand } from '../commands/check-out/check-out.command';
import { GetOrderQuery } from '../queries/get-order/get-order.query';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller } from '@nestjs/common';

@Controller()
export class OrderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(payload: { role: string; userId: number; createOrderDto: CreateOrderDto }): Promise<string | null> {
    return this.commandBus.execute(new CreateOrderCommand(payload.role, payload.userId, payload.createOrderDto));
  }

  @MessagePattern({ cmd: 'get_all_user_orders' })
  async getAllUserOrders(payload: { userId: number }): Promise<OrderResponseDto[]> {
    return this.queryBus.execute(new GetAllOrdersQuery(payload.userId));
  }

  @MessagePattern({ cmd: 'get_order_details' })
  async getOrderDetails(payload: { orderId: number; userId: number; role: string }): Promise<OrderResponseDto> {
    return this.queryBus.execute(new GetOrderQuery(payload.role, payload.userId, payload.orderId));
  }

  @MessagePattern({ cmd: 'check_out' })
  async checkout(payload: { orderId: number; userId: number; role: string }): Promise<string> {
    return this.commandBus.execute(new CheckOutCommand(payload.role, payload.userId, payload.orderId));
  }

  @MessagePattern({ cmd: 'update_order' })
  async updateOrder(payload: {
    role: string;
    orderId: number;
    userId: number;
    updateOrderDto: UpdateOrderDto;
  }): Promise<string> {
    return this.commandBus.execute(
      new UpdateOrderCommand(payload.role, payload.userId, payload.orderId, payload.updateOrderDto),
    );
  }

  @MessagePattern({ cmd: 'cancel_order' })
  async cancelOrder(payload: { orderId: number; userId: number; role: string }): Promise<string> {
    return this.commandBus.execute(new CancelOrderCommand(payload.role, payload.userId, payload.orderId));
  }

  @MessagePattern({ cmd: 'stripe_webhook' })
  async stripeWebhook(payload: { rawBody: string; signature: string }): Promise<string> {
    return this.commandBus.execute(new StripeWebhookCommand(payload.rawBody, payload.signature));
  }

  @MessagePattern({ cmd: 'create_ticket' })
  async createTicket(payload: { role: string; createTicketDto: CreateTicketDto }): Promise<string> {
    return this.commandBus.execute(new CreateTicketCommand(payload.role, payload.createTicketDto));
  }

  @MessagePattern({ cmd: 'get_ticket_details' })
  async getTicketDetails(payload: { ticketId: number }): Promise<TicketDetailResponseDto> {
    return this.queryBus.execute(new GetTicketDetailQuery(payload.ticketId));
  }
}
