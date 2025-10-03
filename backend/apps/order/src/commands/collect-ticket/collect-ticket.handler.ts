import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryService } from '@repository/repository.service';
import { CollectTicketCommand } from './collect-ticket.command';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@app/common';

@CommandHandler(CollectTicketCommand)
export class CollectTicketHandler implements ICommandHandler<CollectTicketCommand> {
  constructor(private readonly repository: RepositoryService) {}

  async execute(command: CollectTicketCommand): Promise<string> {
    const { userId, collectTicketDto } = command;

    const ticket = await this.repository.discountTicket.findById(collectTicketDto.ticketId);

    if (!ticket) {
      throw new RpcException(ErrorCode.TICKET_NOT_FOUND);
    }

    const existing = await this.repository.userTicket.findSavedTicket(userId, collectTicketDto.ticketId);

    if (existing) {
      throw new RpcException(ErrorCode.TICKET_ALREADY_COLLECTED);
    }

    const userTicket = this.repository.userTicket.create({
      userId,
      ticket,
      quantity: ticket.usageLimit,
    });

    await this.repository.userTicket.save(userTicket);

    return `Collect ticket successfully`;
  }
}
