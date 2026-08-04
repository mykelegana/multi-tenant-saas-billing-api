import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Injectable()
export class MembershipsService {
  constructor(private databaseService: DatabaseService, private organizationsService: OrganizationsService) { }

  // Membership of the organization helper -----------------------------------------------

  private async assertMembership(userId: string, orgId: string) {
    try {
      await this.organizationsService.findOneOrg(userId, orgId);
    } catch (error) {
      throw new UnauthorizedException(`You do not belong to the organization with id '${orgId}'`);
    }
  }

  // DELETE /memberships/:orgId/:memberId endpoint service
  async removeMember(userId: string, orgId: string, memberId: string) {
    await this.assertMembership(userId, orgId);

    const deleteMember = await this.databaseService.membership.delete({
      where: {
        id: memberId
      }
    });

    return deleteMember;
  }
}
