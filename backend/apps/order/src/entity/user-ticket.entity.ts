import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { UserTicketStatus } from "@app/common";
import { DiscountTicketEntity } from "./discount-ticket.entity";
import { OrderTicketEntity } from "./order-ticket.entity";


@Entity()
export class UserTicketEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ type: 'enum', enum: UserTicketStatus, default: UserTicketStatus.AVAILABLE })
    status: UserTicketStatus;

    @Column()
    quantity: number;

    @ManyToOne(() => DiscountTicketEntity, (ticket) => ticket.userTickets)
    ticket: DiscountTicketEntity;

    @OneToMany(() => OrderTicketEntity, (orderTicket) => orderTicket.userTicket)
    orderTickets: OrderTicketEntity[];
}