import { StripeService } from "../../modules/stripe/service/stripe.service";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetOrderQuery } from "../../queries/get-order/get-order.query";
import { RepositoryService } from "@repository/repository.service";
import { validateOrder } from "../../helpers/validate-order.helper";
import { CheckOutCommand } from "./check-out.command";
import { PaymentStatus } from "@app/common";


@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
    constructor(
        private readonly repository: RepositoryService,
        private readonly stripeService: StripeService,
        private readonly queryBus: QueryBus,
    ) {}

    async execute(command: CheckOutCommand): Promise<string | null> {
        const { role, userId, orderId } = command;
        const order = await this.queryBus.execute(new GetOrderQuery(role, userId, orderId));

        validateOrder( order, userId, role);

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
        await this.repository.order.update(orderId, {
            sessionId: session.id,
            paymentStatus: PaymentStatus.PROCESSING,
        })

        return session.url;
    }
}