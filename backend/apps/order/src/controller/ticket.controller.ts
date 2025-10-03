import { GetTicketDetailQuery } from '../queries/get-ticket-detail/get-ticket-detail.query';
import { CreateTicketCommand } from '../commands/create-ticket/create-ticket.command';
import { GetAllTicketQuery } from '../queries/get-all-ticket/get-all-ticket.query';
import { CollectTicketDto, CreateTicketDto, TicketDetailResponseDto } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller } from '@nestjs/common';
import { CollectTicketCommand } from '../commands/collect-ticket/collect-ticket.command';

@Controller()
export class TicketController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @MessagePattern({ cmd: 'create_ticket' })
  async createTicket(payload: { role: string; createTicketDto: CreateTicketDto }): Promise<string> {
    return this.commandBus.execute(new CreateTicketCommand(payload.role, payload.createTicketDto));
  }

  @MessagePattern({ cmd: 'get_ticket_details' })
  async getTicketDetails(payload: { ticketId: number }): Promise<TicketDetailResponseDto> {
    return this.queryBus.execute(new GetTicketDetailQuery(payload.ticketId));
  }

  @MessagePattern({ cmd: 'get_all_tickets' })
  async getAllTickets(): Promise<TicketDetailResponseDto[]> {
    return this.queryBus.execute(new GetAllTicketQuery());
  }

  @MessagePattern({ cmd: 'collect_ticket' })
  async collectTicket(payload: { userId: number; collectTicketDto: CollectTicketDto }): Promise<string> {
    return this.commandBus.execute(new CollectTicketCommand(payload.userId, payload.collectTicketDto));
  }
}
