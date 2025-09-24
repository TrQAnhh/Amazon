import {Inject, Injectable} from '@nestjs/common';
import { Stripe } from 'stripe';
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async checkout(line_items: any[]): Promise<Stripe.Checkout.Session> {
      try {
          const session = await this.stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items,
              mode: 'payment',
              success_url: 'https://done.com/success',
              cancel_url: 'https://done.com/cancel',
          });
          return session;
      } catch (error) {
          console.error(error);
          throw new RpcException(error);
      }
  }
}
