import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';
import { UsageService } from '../usage/usage.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly databaseService: DatabaseService, private readonly usageService: UsageService, private organizationsService: OrganizationsService) { }

  private async assertMembership(userId: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }
  }

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

  async findAll(userId: string, orgId: string) {
    const allProject = await this.databaseService.project.findMany({
      where: {
        organizationId: orgId
      }
    });

    return allProject;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
