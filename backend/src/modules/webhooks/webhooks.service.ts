// webhooks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { DatabaseService } from 'src/database/database.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);

    constructor(
        private stripeService: StripeService,
        private databaseService: DatabaseService,
    ) { }

    async handleStripeWebhook(event: Stripe.Event) {
        switch (event.type) {
            case 'checkout.session.completed': {
                await this.handleCheckoutCompleted(event);
                break;
            }

            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
                break;
        }

        return { received: true };
    }

    private async handleCheckoutCompleted(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;

        const organizationId = session.metadata?.organizationId;
        if (!organizationId) {
            this.logger.warn('checkout.session.completed received with no organizationId in metadata');
            return;
        }

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!subscriptionId) {
            this.logger.warn('checkout.session.completed received with no subscription id');
            return;
        }

        // Session only gives us IDs — fetch full subscription details
        const subscription = await this.stripeService.retrieveSubscription(subscriptionId);

        const priceId = subscription.items.data[0].price.id;
        const currentPeriodStart = new Date(subscription.items.data[0].current_period_start * 1000);
        const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000);
        const status = this.mapStripeStatus(subscription.status);

        await this.databaseService.$transaction(async (tx) => {
            await tx.organization.update({
                where: { id: organizationId },
                data: {
                    plan: 'PRO',
                    stripeCustomerId: customerId,
                },
            });

            await tx.subscription.upsert({
                where: { stripeSubscriptionId: subscriptionId },
                create: {
                    organizationId,
                    stripeSubscriptionId: subscriptionId,
                    stripePriceId: priceId,
                    status,
                    currentPeriodStart,
                    currentPeriodEnd,
                },
                update: {
                    stripePriceId: priceId,
                    status,
                    currentPeriodStart,
                    currentPeriodEnd,
                },
            });
        });

        this.logger.log(`Organization ${organizationId} upgraded to PRO (sub: ${subscriptionId})`);
    }

    private mapStripeStatus(stripeStatus: Stripe.Subscription.Status): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' {
        switch (stripeStatus) {
            case 'active':
                return 'ACTIVE';
            case 'past_due':
                return 'PAST_DUE';
            case 'canceled':
                return 'CANCELED';
            default:
                return 'INCOMPLETE';
        }
    }
}