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

  // Organization belongingness of the user, helper ----------------------
  private async findOrgHelper(userId: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }
  }

  // POST /organizations/:orgId/checkout endpoint service
  async checkoutPage(userId: string, userEmail: string, orgId: string) {
    await this.findOrgHelper(userId, orgId);

    const org = await this.databaseService.organization.findUnique({
      where: { id: orgId },
      select: { stripeCustomerId: true },
    });

    if (!org) {
      throw new UnauthorizedException(`Organization '${orgId}' not foundd.`);
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

  // POST /organizations/:orgId/subscription/upgrade endpoint service
  async subscription(userId: string, orgId: string) {

  }

  // GET /organizations/:orgId/subscription endpoint service
  async subscriptionUpgrade(userId: string, orgId: string) {

  }

  // DELETE /organizations/:orgId/subscription endpoint service
  async subscriptionRemove(userId: string, orgId: string) {

  }
}