import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  // POST /projects/:orgId
  @Post(':orgId')
  create(@Req() req, @Param('orgId') orgId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProj(createProjectDto, req.user.id, orgId);
  }

  // GET /projects/:orgId
  @Get(':orgId')
  findAll(@Req() req, @Param('orgId') orgId: string) {
    return this.projectsService.findAll(req.user.id, orgId);
  }

  // GET /projects/:orgId/:projId
  @Get(':orgId/:projId')
  findOne(@Req() req, @Param('orgId') orgId: string, @Param('projId') projId: string) {
    return this.projectsService.findOne(req.user.id, orgId, projId);
  }

  // PATCH /projects/:orgId/:projId
  @Patch(':orgId/:projId')
  update(@Req() req, @Param('orgId') orgId: string, @Param('projId') projId: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProj(updateProjectDto, req.user.id, orgId, projId);
  }

  // DELETE /projects/:orgId/:projId
  @Delete(':orgId/:projId')
  remove(@Req() req, @Param('orgId') orgId: string, @Param('projId') projId: string) {
    return this.projectsService.remove(req.user.id, orgId, projId);
  }
}
