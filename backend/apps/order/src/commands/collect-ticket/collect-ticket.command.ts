import { CollectTicketDto } from '@app/common';

export class CollectTicketCommand {
  constructor(
    public readonly userId: number,
    public readonly collectTicketDto: CollectTicketDto,
  ) {}
}
