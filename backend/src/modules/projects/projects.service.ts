import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';
import { UsageService } from '../usage/usage.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService, private readonly usageService: UsageService, private organizationsService: OrganizationsService) { }

  // Membership of user in organization helper ---------------------------------------------------
  private async assertMembership(userId: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }
  }

  // POST /projects/:orgId endpoint service
  async createProj(createProjectDto: CreateProjectDto, userId: string, orgId: string) {
    await this.assertMembership(userId, orgId);

    await this.usageService.checkLimit(orgId, 'PROJECTS_CREATED');

    const newProj = await this.databaseService.project.create({
      data: {
        organizationId: orgId,
        name: createProjectDto.name,
      }
    });

    if (newProj) {
      await this.usageService.incrementUsage(orgId, 'PROJECTS_CREATED');
    }

    return newProj;
  }

  // GET /projects/:orgId endpoint service
  async findAll(userId: string, orgId: string) {
    await this.assertMembership(userId, orgId);

    const allProject = await this.databaseService.project.findMany({
      where: {
        organizationId: orgId
      }
    });

    return allProject;
  }

  // GET /projects/:orgId/:projId endpoint service
  async findOne(userId: string, orgId: string, projId: string) {
    await this.assertMembership(userId, orgId);

    const findProject = await this.databaseService.project.findFirst({
      where: {
        id: projId,
        organizationId: orgId
      }
    });

    if (!findProject) {
      throw new NotFoundException(`Project with id ${projId} is not found.`)
    }

    return findProject;
  }

  async updateProj(updateProjectDto: UpdateProjectDto, userId: string, orgId: string, projId: string) {
    await this.assertMembership(userId, orgId);

    await this.findOne(userId, orgId, projId);

    const patchProj = await this.databaseService.project.update({
      where: {
        id: projId
      },
      data: {
        ...updateProjectDto
      }
    });

    return patchProj;
  }

  async remove(userId: string, orgId: string, projId: string) {
    await this.assertMembership(userId, orgId);

    await this.findOne(userId, orgId, projId);

    const delProj = await this.databaseService.project.delete({
      where: {
        id: projId
      }
    });

    return delProj;
  }
}
