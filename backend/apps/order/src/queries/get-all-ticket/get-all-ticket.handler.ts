import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllTicketQuery } from './get-all-ticket.query';
import { RepositoryService } from '@repository/repository.service';
import { TicketResponseDto } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetAllTicketQuery)
export class GetAllTicketHandler implements IQueryHandler<GetAllTicketQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetAllTicketQuery): Promise<TicketResponseDto[]> {
    const tickets = await this.repository.discountTicket.findAll();
    return plainToInstance(TicketResponseDto, tickets, {
      excludeExtraneousValues: true,
    });
  }
}
