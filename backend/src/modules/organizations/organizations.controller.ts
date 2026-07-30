import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }


  // POST /organizations
  @Post()
  async create(@Req() req, @Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(req.user.id, createOrganizationDto);
  }

  // GET /organizations
  @Get()
  async findAllOrgs(@Req() req) {
    return this.organizationsService.findAllOrgs(req.user.id);
  }

  // GET /organizations/:id
  @Get(':id')
  async findOneOrg(@Req() req, @Param('id') orgId: string) {
    return this.organizationsService.findOneOrg(req.user.id, orgId);
  }

  // PATCH /organizations/:id
  @Patch(':id')
  update(@Req() req, @Param('id') orgId: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(req.user.id, orgId, updateOrganizationDto);
  }

  // DELETE /organizations/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req, @Param('id') orgId: string) {
    return this.organizationsService.remove(req.user.id, orgId);
  }
}
