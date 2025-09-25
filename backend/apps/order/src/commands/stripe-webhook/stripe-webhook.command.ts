export class StripeWebhookCommand {
    constructor(
        public readonly rawBody: string,
        public readonly signature: string,
    ) {}
}