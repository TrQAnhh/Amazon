import { GetOrderQuery } from "./get-order.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import {
    ErrorCode,
    OrderItemResponseDto,
    OrderResponseDto,
    RepositoryService,
    SERVICE_NAMES,
    UserRole
} from "@app/common";
import { Inject } from "@nestjs/common";
import { getOrderProductDetails } from "../../helpers/get-order-product-details.helper";
import {plainToInstance} from "class-transformer";
import {getUserOrderInfo} from "../../helpers/get-user-order-info.helper";

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
    constructor(
        private readonly repository: RepositoryService,
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
        @Inject(SERVICE_NAMES.PROFILE)
        private readonly profileClient: ClientProxy,
    ) {}

    async execute(query: GetOrderQuery): Promise<OrderResponseDto> {
        const { orderId, userId, role } = query;

        const order = await this.repository.order.findById(orderId);

        if (!order) {
            throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
        }

        if (role !== UserRole.ADMIN && order.userId !== userId) {
            throw new RpcException(ErrorCode.UNAUTHORIZED);
        }

        const products = await getOrderProductDetails(this.productClient, order.items.map((item) => {
            return item.productId;
        }));

        const productMap = new Map(products.map(p => [p.id, p]));

        const orderInfo = await getUserOrderInfo(this.profileClient, userId);

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
            items,
            orderInfo,
        }, { excludeExtraneousValues: true });
    }
}