import {Body, Controller, Get, Inject, Param, Post, Req} from '@nestjs/common';
import { AdminProfileResponseDto, CreateOrderDto, OrderResponseDto, SERVICE_NAMES } from '@app/common';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { ClientProxy } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';

@Controller('order')
export class OrderController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.ORDER) protected client: ClientProxy) {
    super(client);
  }

  @Post('/create')
  async createOrder(@Req() request: any, @Body() createOrderDto: CreateOrderDto): Promise<Response<any>> {
    const userId = request.user.userId;
    const message = await this.sendCommand<string>({ cmd: 'create_order' }, { userId, createOrderDto });
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Get('/my-orders')
  async getAllUserOrders(@Req() request: any): Promise<Response<OrderResponseDto[]>> {
      const userId = request.user.userId;
      const result = await this.sendCommand<OrderResponseDto[]>({ cmd: 'get_all_user_orders' }, { userId });
      return {
          message: `Get all orders that user with id ${userId} has successfully!`,
          success: true,
          data: result,
      }
  }

  @Get('/my-orders/:orderId')
  async getOrderDetails(@Param('orderId') orderId: number): Promise<Response<OrderResponseDto>> {
      const result = await this.sendCommand<OrderResponseDto>({ cmd: 'get_order_details' }, { orderId });
      return {
          message: 'Get order details successfully!',
          success: true,
          data: result,
      }
  }
}
