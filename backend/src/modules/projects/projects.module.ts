import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsageModule } from '../usage/usage.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [DatabaseModule, UsageModule, OrganizationsModule, RateLimitModule]
})
export class ProjectsModule { }
