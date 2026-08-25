import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { RateLimitService } from "./rate-limit.service";
import { DatabaseService } from "src/database/database.service";
import { OrganizationsService } from "../organizations/organizations.service";


@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private readonly rateLimitService: RateLimitService,
        private readonly organizationsService: OrganizationsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const userId = request.user?.id;
        const orgId = request.params?.orgId;             //request payload

        const organization = await this.organizationsService.findOneOrg(userId, orgId); //checks if the user is member of the organization

        await this.rateLimitService.checkLimit(
            orgId,
            organization.plan,
        );

        return true;



    }
}
