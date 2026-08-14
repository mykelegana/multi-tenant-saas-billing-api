import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsageModule } from '../usage/usage.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [DatabaseModule, UsageModule, OrganizationsModule]
})
export class ProjectsModule { }
