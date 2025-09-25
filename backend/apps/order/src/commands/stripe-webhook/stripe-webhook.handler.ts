import {StripeWebhookCommand} from "./stripe-webhook.command";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {OrderEntity} from "../../entity/order.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {StripeService} from "../../modules/stripe/service/stripe.service";
import { OrderStatus} from "@app/common";
import { PaymentStatus} from "@app/common/constants/payment-status.enum";

@CommandHandler(StripeWebhookCommand)
export class StripeWebhookHandler implements ICommandHandler<StripeWebhookCommand> {
    constructor(
        @InjectRepository(OrderEntity)
        private orderRepo: Repository<OrderEntity>,
        private readonly stripeService: StripeService,
    ) {}

    async execute(command: StripeWebhookCommand): Promise<string> {
        const { rawBody, signature } = command;
        const buffer = Buffer.from(rawBody, 'base64');

        const event = await this.stripeService.verifyWebhook(buffer, signature);

        const session = event.data.object as any;

        switch (event.type) {
            case 'checkout.session.completed':

                const result = await this.orderRepo.update(
                    { sessionId: session.id, status: Not(OrderStatus.PAID) },
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
                const failResult = await this.orderRepo.update(
                    { sessionId: session.id, status: Not(OrderStatus.FAILED) },
                    {
                        status: OrderStatus.FAILED,
                        paymentStatus: PaymentStatus.FAILED,
                        intentId: session.payment_intent,
                    }
                );

                if (failResult.affected === 0) {
                    console.warn(`No order updated for failed session ${session.id}.`);
                }
                break;
            default:
                console.log("Unhandled event type: " + event.type);
        }
        return 'Stripe webhook executed successfully.';
    }
}