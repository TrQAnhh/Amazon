import { ErrorCode, OrderStatus, PaymentStatus, SERVICE_NAMES } from "@app/common";
import { getOrderProducts } from "../../helpers/get-order-products.helper";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RepositoryService } from "@repository/repository.service";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { FailOrderCommand } from "./fail-order.command";
import { Inject } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@CommandHandler(FailOrderCommand)
export class FailOrderHandler implements ICommandHandler<FailOrderCommand> {
    constructor(
        @Inject(SERVICE_NAMES.PRODUCT)
        private readonly productClient: ClientProxy,
        private readonly repository: RepositoryService,
    ) {}

    async execute(command: FailOrderCommand): Promise<void> {
        const { sessionId } = command;

        const order = await this.repository.order.findBySessionId(sessionId);

        if(!order) {
            throw new RpcException(ErrorCode.ORDER_NOT_FOUND);
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

        const failResult = await this.repository.order.updateBySessionId(sessionId, {
            status: OrderStatus.FAILED,
            paymentStatus: PaymentStatus.FAILED,
        });

        if (failResult.affected === 0) {
            console.warn(`No order updated for failed session ${sessionId}`);
        }
    }
}