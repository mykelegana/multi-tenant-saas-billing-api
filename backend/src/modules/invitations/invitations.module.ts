import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService],
  imports: [DatabaseModule, OrganizationsModule]
})
export class InvitationsModule { }
