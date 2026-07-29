import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly databaseService: DatabaseService) { }
  create(createOrganizationDto: CreateOrganizationDto) {
    return 'This action adds a new organization';
  }

  async userOrg(email: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        email: email
      }
    });

    return user.org;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
