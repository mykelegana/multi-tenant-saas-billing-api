import { Controller, Post, Req, Res } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) { }

    @Post('stripe')
    async handleStripeWebhook(@Req() req, @Res() res) {
        return this.webhooksService.handleStripeWebhook(req, res)
    }
}
