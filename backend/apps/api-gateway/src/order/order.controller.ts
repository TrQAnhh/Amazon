import {Body, Controller, Delete, Get, Inject, Param, Post, Req} from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto, SERVICE_NAMES } from '@app/common';
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
    const role = request.user.role;
    const userId = request.user.userId;
    const result = await this.sendCommand<string | null>({ cmd: 'create_order' }, { role, userId, createOrderDto });
    return {
      message: 'Create new order successfully!',
      success: true,
      data: result,
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
  async getOrderDetails(
      @Req() request: any,
      @Param('orderId') orderId: number
  ): Promise<Response<OrderResponseDto>> {
      const userId = request.user.userId;
      const role = request.user.role;
      const result = await this.sendCommand<OrderResponseDto>({ cmd: 'get_order_details' }, { role, userId, orderId });

      return {
          message: 'Get order details successfully!',
          success: true,
          data: result,
      }
  }

  @Post('/my-orders/:orderId')
  async checkOut(
      @Req() request: any,
      @Param('orderId') orderId: number
  ): Promise<Response<any>> {
      const userId = request.user.userId;
      const role = request.user.role;
      const url = await this.sendCommand<string>({ cmd: 'check_out' }, { role, userId, orderId });
      return {
          message: `Check out order ${orderId} sucessfully!`,
          success: true,
          data: url,
      }
  }

  @Delete('/my-orders/:orderId')
  async cancelOrder(
      @Req() request: any,
      @Param('orderId') orderId: number
  ): Promise<Response<any>> {
      const userId = request.user.userId;
      const role = request.user.role;
      const message = await this.sendCommand<string>({ cmd: 'cancel_order' }, { role, userId, orderId });
      return {
          message,
          success: true,
          data: null,
      }
  }
}
