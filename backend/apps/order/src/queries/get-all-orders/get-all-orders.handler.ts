import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllOrdersQuery } from "./get-all-orders.query";
import { OrderEntity } from "../../entity/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderResponseDto } from "@app/common";
import { plainToInstance } from "class-transformer";

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) {}

    async execute(query: GetAllOrdersQuery): Promise<OrderResponseDto[]> {
        const { userId } = query;

        const orders = await this.orderRepo.find({
            where: { userId },
        });

        return plainToInstance(OrderResponseDto, orders, {
            excludeExtraneousValues: true,
        });
    }
}