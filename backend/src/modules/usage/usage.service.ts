import { ForbiddenException, Injectable, NotFoundException, RequestTimeoutException, } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UsageMetric } from "@prisma/client";

const PLAN_LIMITS = {
    FREE: {
        API_REQUESTS: 1000,
        PROJECTS_CREATED: 5,
    },
    PRO: {
        API_REQUESTS: 10000,
        PROJECTS_CREATED: 50,
    },
} as const;


@Injectable()
export class UsageService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getUsage(organizationId: string, metric: UsageMetric) {
        const usage = await this.databaseService.usageRecord.findFirst({
            where: { organizationId, metric }
        });
        return usage;
    }

    async incrementUsage(organizationId: string, metric: UsageMetric) {
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

    async checkLimit(organizationId: string, metric: UsageMetric) {
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
}