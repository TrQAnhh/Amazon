import { DynamicModule, Module, Provider } from '@nestjs/common';
import { StripeController } from '../controller/stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from '../service/stripe.service';
import { Stripe } from 'stripe';

@Module({})
export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: 'STRIPE_CLIENT',
      useValue: stripe,
    };

    return {
      module: StripeModule,
      controllers: [StripeController],
      providers: [stripeProvider],
    };
  }
}
