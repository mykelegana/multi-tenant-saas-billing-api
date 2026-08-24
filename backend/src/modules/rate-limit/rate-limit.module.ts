import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';
import { UsageService } from '../usage/usage.service';
import { UsageModule } from '../usage/usage.module';

@Module({
  providers: [RateLimitService, RateLimitGuard],
  imports: [UsageModule]
})
export class RateLimitModule { }
