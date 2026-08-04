import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) { }

  // DELETE /memberships/:orgId/:memberId
  @Delete(':orgId/:memberId')
  @Roles(Role.OWNER, Role.ADMIN)
  removeMember(@Req() req, @Param('orgId') orgId: string, @Param('memberId') memberId: string) {
    return this.membershipsService.removeMember(req.user.id, orgId, memberId);
  }
}
