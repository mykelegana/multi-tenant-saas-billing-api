import { ForbiddenException, Injectable, NotFoundException, RequestTimeoutException, } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UsageMetric } from "@prisma/client";
import { PLAN_LIMITS } from "src/common/constants/plan-limits";


@Injectable()
export class UsageService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getUsage(organizationId: string, metric: UsageMetric) {                        // gets usage count
        const usage = await this.databaseService.usageRecord.findFirst({
            where: { organizationId, metric }
        });
        return usage;
    }

    async incrementUsage(organizationId: string, metric: UsageMetric) {                      // increments usage by 1
        const usage = await this.getUsage(organizationId, metric);

        if (!usage) {
            throw new NotFoundException(`No record found.`);
        }

        return this.databaseService.usageRecord.update({
            where: {
                id: usage.id,
            },
            data: {
                count: {
                    increment: 1
                }
            }
        });
    }

    async checkLimit(organizationId: string, metric: UsageMetric) {                                 // checks usage limit
        const organization = await this.databaseService.organization.findUnique({
            where: {
                id: organizationId,
            },
            select: {
                plan: true,
            },
        });

        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        const limit = PLAN_LIMITS[organization.plan][metric];

        const usage = await this.getUsage(organizationId, metric);

        const currentUsage = usage?.count ?? 0;

        if (currentUsage >= limit) {
            throw new ForbiddenException(`${metric} usage limit exceeded`);
        }

        return {
            allowed: true,
            currentUsage,
            limit,
            remaining: limit - currentUsage,
        };
    }

    async resetUsage(organizationId: string, metric: UsageMetric) {
        const usage = await this.getUsage(organizationId, metric);          // checks if the the organization have used any of the metrics (API REQ, PROJECTS CREATED)

        if (!usage) {
            throw new NotFoundException(`Usage record not found.`);
        }

        const newPeriodStart = usage.periodEnd;                             // sets up the new period of usage at the end of the last usage
        const newPeriodEnd = new Date(newPeriodStart);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);                 // sets up the end of the new period of usage + 1 month of the period start

        return this.databaseService.usageRecord.create({                    // creates the new usage record
            data: {
                organizationId,
                metric,
                count: 0,
                periodStart: newPeriodStart,
                periodEnd: newPeriodEnd
            }
        });
    }


}