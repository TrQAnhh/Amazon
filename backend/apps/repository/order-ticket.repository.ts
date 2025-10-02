import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderTicketEntity } from "../order/src/entity/order-ticket.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderTicketRepository {
    constructor(
        @InjectRepository(OrderTicketEntity)
        private readonly repo: Repository<OrderTicketEntity>,
    ) {}

    create(data: Partial<OrderTicketEntity>): OrderTicketEntity {
        return this.repo.create(data);
    }

    async save(orderTicket: Partial<OrderTicketEntity>): Promise<OrderTicketEntity> {
        return this.repo.save(orderTicket);
    }

    async saveMany(orderTickets: Partial<OrderTicketEntity>[]): Promise<OrderTicketEntity[]> {
        return this.repo.save(orderTickets);
    }

    async findByOrderId(orderId: number): Promise<OrderTicketEntity[]> {
        return this.repo.find({ where: { order: { id: orderId } }, relations: ['userTicket'] });
    }
}
