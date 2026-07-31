import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { DatabaseService } from 'src/database/database.service';
import * as crypto from 'crypto';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class InvitationsService {
  constructor(private databaseService: DatabaseService, private organizationsService: OrganizationsService) { }

  async invite(userId: string, orgId: string, createInvitationDto: CreateInvitationDto) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);  // check if the user is a member of the organization
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }

    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // invitation expires after 7 days

    const invitation = await this.databaseService.invitation.create({
      data: {
        ...createInvitationDto,
        organizationId: orgId,
        token,
        expiresAt,
      },
    });

    return invitation;
  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
