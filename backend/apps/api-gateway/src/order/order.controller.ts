import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { AdminProfileResponseDto, CreateOrderDto, SERVICE_NAMES } from '@app/common';
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
    const userId = request.user.id;
    const message = await this.sendCommand<string>({ cmd: 'create_order' }, { userId, createOrderDto });
    return {
      message: message,
      success: true,
      data: null,
    };
  }
}
