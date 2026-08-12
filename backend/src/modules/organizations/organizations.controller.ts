import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  // POST /organizations
  @Post()
  create(@Req() req, @Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(req.user.id, createOrganizationDto);
  }

  // GET /organizations
  @Get()
  findAllOrgs(@Req() req) {
    return this.organizationsService.findAllOrgs(req.user.id);
  }

  // GET /organizations/:id
  @Get(':id')
  findOneOrg(@Req() req, @Param('id') orgId: string) {
    return this.organizationsService.findOneOrg(req.user.id, orgId);
  }

  // PATCH /organizations/:id
  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)               // only OWNER or ADMIN can UPDATE an organization.
  update(@Req() req, @Param('id') orgId: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(req.user.id, orgId, updateOrganizationDto);
  }

  // DELETE /organizations/:id
  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)               // only OWNER or ADMIN can DELETE an organization.
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('id') orgId: string) {
    return this.organizationsService.remove(req.user.id, orgId);
  }
}
