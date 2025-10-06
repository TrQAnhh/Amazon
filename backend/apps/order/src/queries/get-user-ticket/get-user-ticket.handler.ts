import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTicketQuery } from './get-user-ticket.query';
import { RepositoryService } from '@repository/repository.service';
import { TicketDetailResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetUserTicketQuery)
export class GetUserTicketHandler implements IQueryHandler<GetUserTicketQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetUserTicketQuery): Promise<TicketDetailResponseDto[]> {
    const { userId } = query;

    const tickets = await this.repository.userTicket.findAllUserTickets(userId);

    const mappedTickets = tickets.map((t) => ({
      id: t.ticket.id,
      status: t.status,
      code: t.ticket.code,
      type: t.ticket.type,
      value: Number(t.ticket.value),
      minOrderAmount: Number(t.ticket.minOrderAmount),
      maxDiscount: Number(t.ticket.maxDiscount),
      startDate: t.ticket.startDate,
      endDate: t.ticket.endDate,
      total: t.ticket.total,
      usageLimit: t.ticket.usageLimit,
    }));

    return plainToInstance(TicketDetailResponseDto, mappedTickets, {
      excludeExtraneousValues: true,
    });
  }
}
