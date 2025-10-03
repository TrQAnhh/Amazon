import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto, SERVICE_NAMES, UpdateOrderDto } from '@app/common';
import { Response } from '../common/interceptors/transform/transform.interceptor';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { BaseController } from '../common/base/base.controller';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Order service')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized access' })
@ApiBadRequestResponse({ description: 'Order not found' })
@Controller('order')
export class OrderController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.ORDER) protected client: ClientProxy) {
    super(client);
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Create an order successfully' })
  async createOrder(@Req() request: any, @Body() createOrderDto: CreateOrderDto): Promise<Response<any>> {
    const role = request.user.role;
    const userId = request.user.userId;
    const result = await this.sendCommand<string | null>({ cmd: 'create_order' }, { role, userId, createOrderDto });
    return {
      message: 'Create new order successfully',
      success: true,
      data: result,
    };
  }

  @Get('/my-orders')
  @ApiOkResponse({ description: 'Get all orders that user has successfully', type: [OrderResponseDto] })
  async getAllUserOrders(@Req() request: any): Promise<Response<OrderResponseDto[]>> {
    const userId = request.user.userId;
    const result = await this.sendCommand<OrderResponseDto[]>({ cmd: 'get_all_user_orders' }, { userId });
    return {
      message: `Get all orders that user with id ${userId} has successfully`,
      success: true,
      data: result,
    };
  }

  @Get('/my-orders/:orderId')
  @ApiOkResponse({ description: 'Get order details successfully', type: OrderResponseDto })
  async getOrderDetails(@Req() request: any, @Param('orderId') orderId: number): Promise<Response<OrderResponseDto>> {
    const userId = request.user.userId;
    const role = request.user.role;
    const result = await this.sendCommand<OrderResponseDto>({ cmd: 'get_order_details' }, { role, userId, orderId });

    return {
      message: 'Get order details successfully',
      success: true,
      data: result,
    };
  }

  @Post('/my-orders/:orderId')
  @ApiOkResponse({ description: 'Check out order successfully' })
  async checkOut(@Req() request: any, @Param('orderId') orderId: number): Promise<Response<any>> {
    const userId = request.user.userId;
    const role = request.user.role;
    const url = await this.sendCommand<string>({ cmd: 'check_out' }, { role, userId, orderId });
    return {
      message: `Check out order ${orderId} successfully`,
      success: true,
      data: url,
    };
  }

  @Patch('/my-orders/:orderId')
  @ApiOkResponse({ description: 'Update order successfully' })
  async updateOrder(
    @Req() request: any,
    @Payload() updateOrderDto: UpdateOrderDto,
    @Param('orderId') orderId: number,
  ): Promise<Response<any>> {
    const role = request.user.role;
    const userId = request.user.userId;
    const message = await this.sendCommand<string>({ cmd: 'update_order' }, { role, userId, orderId, updateOrderDto });
    return {
      message: message,
      success: true,
      data: null,
    };
  }

  @Delete('/my-orders/:orderId')
  @ApiOkResponse({ description: 'Delete order successfully' })
  async cancelOrder(@Req() request: any, @Param('orderId') orderId: number): Promise<Response<any>> {
    const userId = request.user.userId;
    const role = request.user.role;
    const message = await this.sendCommand<string>({ cmd: 'cancel_order' }, { role, userId, orderId });
    return {
      message,
      success: true,
      data: null,
    };
  }
}
