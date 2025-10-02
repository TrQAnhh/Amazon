import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTicketCommand } from "./create-ticket.command";
import { RepositoryService } from "@repository/repository.service";
import { RpcException } from "@nestjs/microservices";
import { ErrorCode, UserRole } from "@app/common";

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler implements ICommandHandler<CreateTicketCommand> {
    constructor (
        private readonly repository: RepositoryService
    ) {}

    async execute(command: CreateTicketCommand): Promise<string> {
        const { role, createTicketDto } = command;

        if (role !== UserRole.ADMIN) {
            throw new RpcException(ErrorCode.UNAUTHORIZED);
        }

        const existingTicket = await this.repository.discountTicket.findByCode(createTicketDto.code);

        if (existingTicket) {
            throw new RpcException(ErrorCode.TICKET_ALREADY_EXISTED);
        }

        const ticket = this.repository.discountTicket.create({
            ...createTicketDto,
            startDate: new Date(createTicketDto.startDate),
            endDate: new Date(createTicketDto.endDate),
        });
        await this.repository.discountTicket.save(ticket);

        return 'Create new ticket successfully';
    }
}