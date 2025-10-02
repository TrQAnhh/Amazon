import { CreateTicketDto } from "@app/common";

export class CreateTicketCommand {
    constructor(
        public readonly role: string,
        public readonly createTicketDto: CreateTicketDto
    ) {}
}