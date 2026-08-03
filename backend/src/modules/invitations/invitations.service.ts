import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { DatabaseService } from 'src/database/database.service';
import * as crypto from 'crypto';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class InvitationsService {
  constructor(private databaseService: DatabaseService, private organizationsService: OrganizationsService) { }

  private async assertMembership(userId: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }
  }

  async invite(userId: string, orgId: string, createInvitationDto: CreateInvitationDto) {
    await this.assertMembership(userId, orgId);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.databaseService.invitation.create({
      data: {
        ...createInvitationDto,
        organizationId: orgId,
        token,
        expiresAt,
      },
    });
  }

  async findAll(userId: string, orgId: string) {
    await this.assertMembership(userId, orgId);

    return this.databaseService.invitation.findMany({
      where: { organizationId: orgId },
    });
  }

  async remove(userId: string, orgId: string, invitationId: string) {
    await this.assertMembership(userId, orgId);

    const invitation = await this.databaseService.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.organizationId !== orgId) {
      throw new NotFoundException(`No invitation with id '${invitationId}' found in this organization.`);
    }

    await this.databaseService.invitation.delete({
      where: { id: invitationId },
    });

    return;
  }

  async acceptInvite(userId: string, userEmail: string, token: string) {
    const invitation = await this.databaseService.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException(`There is no invitation with token '${token}'.`);
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenException(`This invitation was not sent to your account's email address.`);
    }

    if (Date.now() > invitation.expiresAt.getTime()) {
      throw new UnauthorizedException(`Invitation expired.`);
    }

    if (invitation.acceptedAt) {
      throw new ConflictException(`Invitation already accepted on ${invitation.acceptedAt.toLocaleString()}`);
    }

    const result = await this.databaseService.$transaction(async (tx) => {
      const membership = await tx.membership.create({
        data: {
          userId,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      });

      const updatedInvitation = await tx.invitation.update({
        where: { token },
        data: { acceptedAt: new Date() },
      });

      return { membership, updatedInvitation };
    });

    return { membership: result.membership, invitation: result.updatedInvitation };
  }
}