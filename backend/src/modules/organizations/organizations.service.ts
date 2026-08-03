import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) { }

  // POST /organizations endpoint service
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

  // GET /organizations endpoint service
  async findAllOrgs(userId: string) {
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

  // GET /organizations/:id endpoint service
  async findOneOrg(userId: string, orgId: string) {
    const findOrg = await this.databaseService.organization.findFirst({
      where: {
        id: orgId,
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

    if (!findOrg) {
      throw new NotFoundException(`Organization with id ${orgId} not found.`);
    }

    return findOrg;
  }

  // PATCH /organizations/:id endpoint service
  async update(userId: string, orgId: string, updateOrganizationDto: UpdateOrganizationDto) {
    const findOrg = await this.findOneOrg(userId, orgId);

    if (!findOrg) {
      throw new NotFoundException(`Organization with id ${orgId} not found.`);
    }

    if (updateOrganizationDto.slug) {
      const existingSlug = await this.databaseService.organization.findUnique({
        where: {
          slug: updateOrganizationDto.slug
        }
      });

      if (existingSlug && existingSlug.id !== orgId) {
        throw new ConflictException(`Organization with slug '${updateOrganizationDto.slug}' already exists.`);
      }
    }

    const updated = await this.databaseService.organization.update({
      where: {
        id: orgId
      },
      data: {
        ...updateOrganizationDto
      }
    });

    return updated;
  }

  async remove(userId: string, orgId: string) {
    const findOrg = await this.findOneOrg(userId, orgId);

    if (!findOrg) {
      throw new NotFoundException(`Organization with id ${orgId} not found.`);
    };

    const deleteOrg = await this.databaseService.organization.delete({
      where: {
        id: orgId
      }
    });

    return deleteOrg;
  }
}
