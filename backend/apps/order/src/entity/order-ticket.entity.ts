import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { UserTicketEntity } from "./user-ticket.entity";
import { OrderEntity } from "./order.entity";

@Entity()
export class OrderTicketEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @ManyToOne(() => OrderEntity, (order) => order.orderTickets, {
        onDelete: 'CASCADE',
    })
    order: OrderEntity;

    @ManyToOne(() => UserTicketEntity, (userTicket) => userTicket.orderTickets, {
        onDelete: 'CASCADE',
    })
    userTicket: UserTicketEntity;
}