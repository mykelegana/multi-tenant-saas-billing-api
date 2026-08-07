// subscriptions.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { StripeService } from '../stripe/stripe.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly databaseService: DatabaseService,
    private readonly organizationsService: OrganizationsService,
  ) { }

  async checkoutPage(userId: string, userEmail: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }

    const org = await this.databaseService.organization.findUnique({
      where: { id: orgId },
      select: { stripeCustomerId: true },
    });

    if (!org) {
      throw new UnauthorizedException(`Organization '${orgId}' not found.`);
    }

    return this.stripeService.createCheckoutSession({
      priceId: process.env.STRIPE_PRO_PRICE_ID!,
      customerId: org.stripeCustomerId ?? undefined,
      customerEmail: org.stripeCustomerId ? undefined : userEmail,
      successUrl: 'http://localhost:3000/billing/success',
      cancelUrl: 'http://localhost:3000/billing/cancel',
      metadata: {
        organizationId: orgId,
      },
    });
  }

  async subscription(userId: string, orgId: string) {

  }

  async subscriptionUpgrade(userId: string, orgId: string) {

  }

  async subscriptionRemove(userId: string, orgId: string) {

  }
}