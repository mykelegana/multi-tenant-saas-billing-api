import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)                     // This whole controller can only be accessed by org OWNER or ADMIN
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post(':orgId/checkout')
  checkout(@Req() req, @Param('orgId') orgId: string) {
    return this.subscriptionsService.checkoutPage(req.user.id, req.user.email, orgId);
  }

  @Post(':orgId/subscription/upgrade')
  upgrade(@Req() req, @Param('orgId') orgId: string) {
    return this.subscriptionsService.subscriptionUpgrade(req.user.id, orgId);
  }

  @Get(':orgId/subscription')
  subscription(@Req() req, @Param('orgId') orgId: string) {
    return this.subscriptionsService.subscription(req.user.id, orgId);
  }

  @Delete(':orgId/subscription')
  remove(@Req() req, @Param('orgId') orgId: string) {
    return this.subscriptionsService.subscriptionRemove(req.user.id, orgId);
  }
}
