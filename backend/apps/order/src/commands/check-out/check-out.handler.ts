import {CommandHandler, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import {CheckOutCommand} from "./check-out.command";
import {InjectRepository} from "@nestjs/typeorm";
import {OrderEntity} from "../../entity/order.entity";
import {Repository} from "typeorm";
import {GetOrderQuery} from "../../queries/get-order/get-order.query";
import {StripeService} from "../../modules/stripe/service/stripe.service";
import {PaymentStatus} from "@app/common/constants/payment-status.enum";
import {RpcException} from "@nestjs/microservices";
import {ErrorCode, UserRole} from "@app/common";

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        private readonly stripeService: StripeService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: CheckOutCommand): Promise<string | null> {
        const { role, userId, orderId } = command;
        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        if (order.paymentStatus === PaymentStatus.PAID) {
            throw new RpcException(ErrorCode.ORDER_ALREADY_PAID);
        }

        if (role !== UserRole.ADMIN && order.userId !== userId) {
            throw new RpcException(ErrorCode.UNAUTHORIZED);
        }

        const lineItems = order.items.map(item => ({
            price_data: {
                currency: 'usd',
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.product.name,
                    images: item.product.imageUrl ? [item.product.imageUrl] : [],
                },
            },
            quantity: item.quantity,
        }));

        const session = await this.stripeService.checkout(orderId,lineItems);
        await this.orderRepository.update({ id: orderId }, { sessionId: session.id });

        return session.url;
    }
}