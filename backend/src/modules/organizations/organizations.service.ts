import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(userId: string, createOrganizationDto: CreateOrganizationDto) {
    const findSlug = await this.databaseService.organization.findFirst({
      where: { slug: createOrganizationDto.slug }
    });
    if (findSlug) {
      throw new ConflictException(`The organization slug ${createOrganizationDto.slug} is already taken.`)
    }

    const organization = await this.databaseService.$transaction(async (tx) => {
      const newOrg = await tx.organization.create({
        data: {
          name: createOrganizationDto.name,
          slug: createOrganizationDto.slug
        }
      });
      const ownerMembership = await tx.membership.create({
        data: {
          userId: userId,
          organizationId: newOrg.id,
          role: Role.OWNER
        }
      });
      return { newOrg, ownerMembership };
    });
    return { organization: organization.newOrg, membership: organization.ownerMembership };
  }

  async findUserOrgs(userId: string) {
    const userOrgs = await this.databaseService.organization.findMany({
      where: {
        memberships: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        memberships: {
          where: {
            userId: userId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    return userOrgs;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
