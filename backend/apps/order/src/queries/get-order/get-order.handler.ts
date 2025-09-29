import { ErrorCode,  OrderItemResponseDto,  OrderResponseDto, PaymentStatus,  SERVICE_NAMES,  UserRole } from "@app/common";
import { getOrderProductDetails } from "../../helpers/get-order-product-details.helper";
import { getUserOrderInfo } from "../../helpers/get-user-order-info.helper";
import { StripeService } from "../../modules/stripe/service/stripe.service";
import { RepositoryService } from "@repository/repository.service";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { plainToInstance } from "class-transformer";
import { GetOrderQuery } from "./get-order.query";
import { Inject } from "@nestjs/common";

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
    constructor(
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
        @Inject(SERVICE_NAMES.PROFILE)
        private readonly profileClient: ClientProxy,
        private readonly repository: RepositoryService,
        private readonly stripeService: StripeService,
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

        let checkoutUrl: string | undefined;
        if (order.paymentStatus === PaymentStatus.PROCESSING && order.sessionId) {
            checkoutUrl = await this.stripeService.retrieveCheckoutUrl(order.sessionId);
        }


        return plainToInstance(OrderResponseDto,{
            ...order,
            items,
            orderInfo,
            checkoutUrl,
        }, { excludeExtraneousValues: true });
    }
}