import { ErrorCode, OrderResponseDto, RepositoryService } from "@app/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllOrdersQuery } from "./get-all-orders.query";
import { plainToInstance } from "class-transformer";
import { RpcException } from "@nestjs/microservices";

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
    constructor(
        private readonly repository: RepositoryService,
    ) {}

    async execute(query: GetAllOrdersQuery): Promise<OrderResponseDto[]> {
        const { userId } = query;

        const orders = await this.repository.order.findAllByUserId(userId);

        if(!orders) {
            throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
        }

        return plainToInstance(OrderResponseDto, orders, {
            excludeExtraneousValues: true,
        });
    }
}