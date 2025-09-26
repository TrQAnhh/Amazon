import { ErrorCode, RepositoryService, SERVICE_NAMES, UserRole } from "@app/common";
import { getOrderProducts } from "../../helpers/get-order-products.helper";
import { PaymentStatus } from "../../constants/enums/payment-status.enum";
import { OrderStatus } from "../../constants/enums/order-status.enum";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetOrderQuery } from "../../queries/get-order/get-order.query";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CancelOrderCommand } from "./cancel-order.command";
import { Inject } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
    constructor(
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
        private readonly repository: RepositoryService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: CancelOrderCommand): Promise<string> {
        const { role, userId, orderId } = command;

        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        if (!order || order.status === OrderStatus.CANCELED) {
            throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
        }

        if (role !== UserRole.ADMIN && order.userId !== userId) {
            throw new RpcException(ErrorCode.UNAUTHORIZED);
        }

        const orderItems = await getOrderProducts(this.productClient,
            order.items.map((item) => {
                return item.productId;
            })
        );

        const products = new Map(orderItems.map((product) => {
            return [product.id, product];
        }));

        const restoreStock = order.items.map((item) => {
            const product = products.get(item.productId)!;
            return {
                productId: item.productId,
                newStock: product.availableStock + item.quantity,
            };
        });

        try {
            await firstValueFrom(this.productClient.send({ cmd: 'update_stock' }, { items: restoreStock }));
        } catch (err) {
            throw new RpcException(err);
        }

        await this.repository.order.update(order.id,{
            status: OrderStatus.CANCELED,
            paymentStatus: PaymentStatus.CANCELED,
        })

        return 'Cancel order successfully';
    }
}