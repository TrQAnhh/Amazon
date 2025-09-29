import { OrderStatus, PaymentStatus } from "@app/common";
import { StripeService } from "../../modules/stripe/service/stripe.service";
import { StripeWebhookCommand } from "./stripe-webhook.command";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RepositoryService } from "@repository/repository.service";
import { FailOrderCommand } from "../fail-order/fail-order.command";

@CommandHandler(StripeWebhookCommand)
export class StripeWebhookHandler implements ICommandHandler<StripeWebhookCommand> {
    constructor(
        private readonly repository: RepositoryService,
        private readonly stripeService: StripeService,
        private readonly commandBus: CommandBus,
    ) {}

    async execute(command: StripeWebhookCommand): Promise<string> {
        const { rawBody, signature } = command;
        const buffer = Buffer.from(rawBody, 'base64');

        const event = await this.stripeService.verifyWebhook(buffer, signature);

        const session = event.data.object as any;

        switch (event.type) {
            case 'checkout.session.completed':

                const result = await this.repository.order.updateBySessionId(session.id,
                    {
                        status: OrderStatus.PAID,
                        paymentStatus: PaymentStatus.PAID,
                        intentId: session.payment_intent
                    }
                );

                if (result.affected === 0) {
                    console.warn(`No order updated for session ${session.id}.`);
                }

                break;

            case 'checkout.session.expired':
            case 'payment_intent.payment_failed':
                await this.commandBus.execute(new FailOrderCommand(session.id));
                break;
            default:
                console.log("Unhandled event type: " + event.type);
        }
        return 'Stripe webhook executed successfully.';
    }
}