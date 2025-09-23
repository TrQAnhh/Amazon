import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  }

  checkout() {}
}
