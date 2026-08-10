import { Global, Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { StripeModule } from '../stripe/stripe.module';
import { WebhooksService } from './webhooks.service';
import { DatabaseModule } from 'src/database/database.module';

@Global()
@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  imports: [StripeModule, DatabaseModule]
})
export class WebhooksModule { }
