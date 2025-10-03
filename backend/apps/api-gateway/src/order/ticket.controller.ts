import type { Response } from '../common/interceptors/transform/transform.interceptor';
import { Body, Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';
import {
  CollectTicketDto,
  CreateTicketDto,
  SERVICE_NAMES,
  TicketDetailResponseDto,
  TicketResponseDto,
} from '@app/common';
import { BaseController } from '../common/base/base.controller';
import { Public } from '../common/decorators/public.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Ticket')
@ApiUnauthorizedResponse({ description: 'Unauthorized access' })
@Controller('ticket')
export class TicketController extends BaseController {
  constructor(@Inject(SERVICE_NAMES.ORDER) protected client: ClientProxy) {
    super(client);
  }

  @Public()
  @Get()
  @ApiOkResponse({ description: 'Get all tickets successfully', type: [TicketResponseDto] })
  async getAllTickets() {
    const result = await this.sendCommand<TicketResponseDto[]>({ cmd: 'get_all_tickets' });
    return {
      message: 'Get all tickets successfully',
      success: true,
      data: result,
    };
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Create new ticket successfully' })
  async createTicket(@Req() request: any, @Body() createTicketDto: CreateTicketDto): Promise<Response<any>> {
    const role = request.user.role;
    const message = await this.sendCommand<string>({ cmd: 'create_ticket' }, { role, createTicketDto });
    return {
      message,
      success: true,
      data: null,
    };
  }

  @Get('/:ticketId')
  @ApiOkResponse({ description: 'Get ticket details successfully', type: TicketDetailResponseDto })
  async getTicketDetails(@Param('ticketId') ticketId: number) {
    const result = await this.sendCommand<TicketDetailResponseDto>({ cmd: 'get_ticket_details' }, { ticketId });
    return {
      message: 'Get ticket details successfully',
      success: true,
      data: result,
    };
  }

  @Post('/collect')
  @ApiOkResponse({ description: 'Collect ticket successfully', type: Response })
  async collectTicket(@Req() request: any, @Body() collectTicketDto: CollectTicketDto): Promise<Response<any>> {
    const userId = request.user.userId;
    const message = await this.sendCommand<string>({ cmd: 'collect_ticket' }, { userId, collectTicketDto });

    return {
      message,
      success: true,
      data: null,
    };
  }
}
