import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketDetailQuery } from './get-ticket-detail.query';
import { RepositoryService } from '@repository/repository.service';
import { RpcException } from '@nestjs/microservices';
import { TicketDetailResponseDto, ErrorCode } from '@app/common';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetTicketDetailQuery)
export class GetTicketDetailHandler implements IQueryHandler<GetTicketDetailQuery> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(query: GetTicketDetailQuery): Promise<TicketDetailResponseDto> {
    const { id } = query;

    const ticket = await this.repository.discountTicket.findById(id);

    if (!ticket) {
      throw new RpcException(ErrorCode.TICKET_NOT_FOUND);
    }

    return plainToInstance(TicketDetailResponseDto, ticket, {
      excludeExtraneousValues: true,
    });
  }
}
