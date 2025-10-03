import { Injectable } from '@nestjs/common';
import { OrderItemEntity } from '../order/src/entity/order-items.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly repo: Repository<OrderItemEntity>,
  ) {}

  create(partial: Partial<OrderItemEntity>): OrderItemEntity {
    return this.repo.create(partial);
  }

  async saveMany(items: OrderItemEntity[]): Promise<OrderItemEntity[]> {
    return this.repo.save(items);
  }
}
