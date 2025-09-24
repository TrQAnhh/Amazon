import {Inject, Injectable} from '@nestjs/common';
import { Stripe } from 'stripe';
import {CreateOrderDto} from "@app/common";

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

    async checkout(line_items: any[],success_url: string,cancel_url: string): Promise<string | null> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url,
            cancel_url,
        });

        return session.url;
    }
}
