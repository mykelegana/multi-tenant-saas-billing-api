import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':id/invite')
  invite(@Req() req, @Param('id') orgId: string, @Body() createInvitationDto: CreateInvitationDto) {
    return this.invitationsService.invite(req.user.id, orgId, createInvitationDto);
  }

  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvitationDto: UpdateInvitationDto) {
    return this.invitationsService.update(+id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(+id);
  }
}
