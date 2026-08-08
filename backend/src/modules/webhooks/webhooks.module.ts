import { Global, Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { StripeModule } from '../stripe/stripe.module';
import { WebhooksService } from './webhooks.service';

@Global()
@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  imports: [StripeModule]
})
export class WebhooksModule { }
