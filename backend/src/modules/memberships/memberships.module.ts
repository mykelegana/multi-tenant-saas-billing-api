import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  controllers: [MembershipsController],
  providers: [MembershipsService],
  imports: [DatabaseModule, OrganizationsModule]
})
export class MembershipsModule { }
