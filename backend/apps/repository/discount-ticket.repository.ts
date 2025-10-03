import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountTicketEntity } from '../order/src/entity/discount-ticket.entity';
import { Repository } from 'typeorm';
import { DiscountStatus } from '@app/common';

@Injectable()
export class DiscountTicketRepository {
  constructor(
    @InjectRepository(DiscountTicketEntity)
    private readonly repo: Repository<DiscountTicketEntity>,
  ) {}

  async findAll(): Promise<DiscountTicketEntity[]> {
    return await this.repo.find({
      where: { status: DiscountStatus.ACTIVE },
    });
  }

  async findById(id: number): Promise<DiscountTicketEntity | null> {
    return await this.repo.findOne({
      where: {
        id,
        status: DiscountStatus.ACTIVE,
      },
    });
  }

  async findByCode(code: string): Promise<DiscountTicketEntity | null> {
    return await this.repo.findOne({
      where: {
        code,
        status: DiscountStatus.ACTIVE,
      },
    });
  }

  create(data: Partial<DiscountTicketEntity>): DiscountTicketEntity {
    return this.repo.create(data);
  }

  async save(data: DiscountTicketEntity): Promise<DiscountTicketEntity> {
    return await this.repo.save(data);
  }
}
