import { OrderStatus } from "@app/common/constants/order-status.enum";
import { OrderEntity } from "../order/src/entity/order.entity";
import { Not, Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repo: Repository<OrderEntity>
    ) {}

    create(partial: Partial<OrderEntity>): OrderEntity {
        return this.repo.create(partial);
    }

    async save(order: OrderEntity): Promise<OrderEntity> {
        return this.repo.save(order);
    }

    async findAllByUserId(userId: number): Promise<OrderEntity[]> {
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: number): Promise<OrderEntity | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['items'],
        })
    }

    async findBySessionId(sessionId: string): Promise<OrderEntity | null> {
        return this.repo.findOne({
            where: { sessionId },
            relations: ['items'],
        })
    }

    async update(id: number, partial: Partial<OrderEntity>): Promise<UpdateResult> {
        return this.repo.update(id, partial);
    }

    async updateBySessionId(sessionId: string, partial: Partial<OrderEntity>): Promise<UpdateResult> {
        return this.repo.update(
            { sessionId, status: Not(OrderStatus.PAID) },
            partial
        );
    }
}