// webhooks.controller.ts
import { Controller, Post, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { StripeService } from '../stripe/stripe.service';

@Controller('webhooks')
export class WebhooksController {
    constructor(
        private readonly webhooksService: WebhooksService,
        private readonly stripeService: StripeService,
    ) { }

    @Post('stripe')
    async handleStripeWebhook(@Req() req) {
        const signature = req.headers['stripe-signature'];

        const event = await this.stripeService.constructEvent({
            rawBody: req.rawBody,
            signature,
            endpointSecret: process.env.STRIPE_WEBHOOK_SECRET!,
        });

        return this.webhooksService.handleStripeWebhook(event);
    }
}