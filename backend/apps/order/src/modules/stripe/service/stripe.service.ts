import {Inject, Injectable} from '@nestjs/common';
import { Stripe } from 'stripe';
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async checkout(orderId: number, line_items: any[]): Promise<Stripe.Checkout.Session> {
      try {
          const session = await this.stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items,
              mode: 'payment',
              success_url: process.env.SUCCESSFUL_URL,
              cancel_url: `${process.env.CANCEL_URL}/${orderId}`,
              expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
          });
          return session;
      } catch (error) {
          console.error(error);
          throw new RpcException(error);
      }
  }

  async verifyWebhook(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
    try {
        return this.stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err) {
        throw new RpcException(`Webhook signature verification failed: ${err.message}`);
    }
  }
}
