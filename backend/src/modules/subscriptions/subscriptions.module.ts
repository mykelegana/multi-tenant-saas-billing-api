import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { StripeModule } from '../stripe/stripe.module';
import { DatabaseModule } from 'src/database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [StripeModule, DatabaseModule, OrganizationsModule]
})
export class SubscriptionsModule { }
