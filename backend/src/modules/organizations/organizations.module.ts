import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [DatabaseModule]
})
export class OrganizationsModule { }
