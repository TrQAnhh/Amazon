import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserTicketEntity } from "../order/src/entity/user-ticket.entity";
import { Repository } from "typeorm";
import { UserTicketStatus } from "@app/common";

@Injectable()
export class UserTicketRepository {
    constructor(
        @InjectRepository(UserTicketEntity)
        private readonly repo: Repository<UserTicketEntity>,
    ) {}

    create(data: Partial<UserTicketEntity>): UserTicketEntity {
        return this.repo.create(data);
    }

    async findSavedTicket(userId: number, ticketId: number): Promise<UserTicketEntity | null> {
        return await this.repo.findOne({
            where: {
                userId,
                ticket: { id: ticketId },
                status: UserTicketStatus.AVAILABLE
            },
        });
    }

    async save(userTicket: Partial<UserTicketEntity>): Promise<UserTicketEntity> {
        return this.repo.save(userTicket);
    }
}