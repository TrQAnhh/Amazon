import { GetOrderQuery } from "./get-order.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../entity/order.entity";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import {ErrorCode, OrderItemResponseDto, OrderResponseDto, SERVICE_NAMES} from "@app/common";
import { Inject } from "@nestjs/common";
import { getOrderProductDetails } from "../../helpers/get-order-product-details.helper";
import {plainToInstance} from "class-transformer";

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
    ) {}

    async execute(query: GetOrderQuery): Promise<OrderResponseDto> {
        const { orderId } = query;

        const order = await this.orderRepo.findOne({
            where: {
                id: orderId,
            },
            relations: ['items'],
        });

        if (!order) {
            throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
        }

        const products = await getOrderProductDetails(this.productClient, order.items.map((item) => {
            return item.productId;
        }));

        const productMap = new Map(products.map(p => [p.id, p]));

        const items = plainToInstance(OrderItemResponseDto, order.items.map(item => {
            const product = productMap.get(item.productId);
            if (!product) throw new RpcException(ErrorCode.PRODUCT_NOT_FOUND);

            return {
                ...item,
                product: {
                    name: product.name,
                    imageUrl: product.imageUrl,
                }
            };
        }), { excludeExtraneousValues: true });

        return plainToInstance(OrderResponseDto,{
            ...order,
            items
        }, { excludeExtraneousValues: true });
    }
}