import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DiscountStatus, DiscountType } from '@app/common';
import { UserTicketEntity } from './user-ticket.entity';

@Entity()
export class DiscountTicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscount: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  total: number;

  @Column()
  usageLimit: number;

  @Column({ type: 'enum', enum: DiscountStatus, default: DiscountStatus.ACTIVE })
  status: DiscountStatus;

  @OneToMany(() => UserTicketEntity, (userTicket) => userTicket.ticket)
  userTickets: UserTicketEntity[];
}
