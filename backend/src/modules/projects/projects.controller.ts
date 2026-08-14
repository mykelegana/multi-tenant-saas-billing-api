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
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post(':orgId')
  @Roles(Role.OWNER, Role.ADMIN)
  create(@Req() req, @Param('orgId') orgId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProj(createProjectDto, req.user.id, orgId);
  }

  @Get(':orgId')
  @Roles(Role.OWNER, Role.ADMIN)
  findAll(@Req() req, @Param('orgId') orgId: string) {
    return this.projectsService.findAll(req.user.id, orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
