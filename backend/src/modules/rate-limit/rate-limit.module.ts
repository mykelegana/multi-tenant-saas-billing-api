import { Module } from '@nestjs/common';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';
import { UsageModule } from '../usage/usage.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  providers: [RateLimitService, RateLimitGuard],
  imports: [UsageModule, OrganizationsModule],
  exports: [RateLimitService]
})
export class RateLimitModule { }
