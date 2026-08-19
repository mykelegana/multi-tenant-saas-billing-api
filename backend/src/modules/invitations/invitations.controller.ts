import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('organizations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) { }

  //--- only OWNER or ADMIN permitted endpoints -----------------------------------

  // POST /organizations/:id/invitations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/invitations')
  invite(@Req() req, @Param('id') orgId: string, @Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationsService.invite(req.user.id, orgId, createInvitationDto);
  }

  // GET /organizations/:id/invitations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Get(':id/invitations')
  findAll(@Req() req, @Param('id') orgId: string) {
    return this.invitationsService.findAll(req.user.id, orgId);
  }

  // DELETE /organizations/:id/invitations/:invitationId
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':id/invitations/:invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('id') orgId: string, @Param('invitationId') invitationId: string) {
    return this.invitationsService.remove(req.user.id, orgId, invitationId);
  }

  //--- any authenticated user ------------------------------------------------------


  // POST /organizations/invitations/:token/accept
  @UseGuards(JwtAuthGuard)
  @Post('invitations/:token/accept')
  acceptInvite(@Req() req, @Param('token') token: string) {
    return this.invitationsService.acceptInvite(req.user.id, req.user.email, token);
  }
}