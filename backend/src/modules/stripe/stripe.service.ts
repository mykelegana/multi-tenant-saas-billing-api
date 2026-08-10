import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) { }

    async createCheckoutSession(params: {
        priceId: string;
        customerId?: string;
        customerEmail?: string;
        successUrl: string;
        cancelUrl: string;
        metadata?: Record<string, string>;
    }): Promise<{ url: string }> {
        const session = await this.stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: params.priceId,
                    quantity: 1,
                },
            ],
            customer: params.customerId,
            customer_email: params.customerId ? undefined : params.customerEmail,
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: params.metadata,
        });

        if (!session.url) {
            throw new Error('Stripe did not return a checkout session URL.');
        }

        return { url: session.url };
    }

    async constructEvent(params: {
        rawBody: string;
        signature: string;
        endpointSecret: string;
    }): Promise<Stripe.Event> {
        let event: Stripe.Event;
        try {
            event = this.stripe.webhooks.constructEvent(
                params.rawBody,
                params.signature,
                params.endpointSecret,
            );
            return event;
        } catch (error) {
            throw new BadRequestException(`Webhook signature verification failed.`);
        }
    }

    async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.retrieve(subscriptionId);
    }
}