import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItemEntity } from './order-items.entity';
import { OrderStatus } from "@app/common/constants/order-status.enum";
import { PaymentStatus } from "@app/common/constants/payment-status.enum";
import { PaymentMethod } from "@app/common/constants/payment-method.enum";

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  sessionId?: string;

  @Column({ nullable: true })
  intentId?: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
