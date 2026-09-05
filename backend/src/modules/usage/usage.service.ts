import { ForbiddenException, Injectable, NotFoundException, Inject } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UsageMetric, UsageRecord } from "@prisma/client";
import { PLAN_LIMITS } from "src/common/constants/plan-limits";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";


@Injectable()
export class UsageService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly databaseService: DatabaseService
    ) { }

    async getUsage(organizationId: string, metric: UsageMetric) { // gets usage count

        const cacheKey = `usage:getUsage:${organizationId}:${metric}`;

        const cached = await this.cacheManager.get<UsageRecord>(cacheKey); // checks if there is already cached data in redis
        if (cached) return cached; // returns if there is

        const usage = await this.databaseService.usageRecord.findFirst({
            where: {
                organizationId,
                metric,
                periodStart: {
                    lte: new Date(),
                },
                periodEnd: {
                    gt: new Date(),
                },
            }
        });

        await this.cacheManager.set(cacheKey, usage);
        return usage;
    }

    async incrementUsage(organizationId: string, metric: UsageMetric) {                  // increments usage by 1
        const usage = await this.getUsage(organizationId, metric);

        if (!usage) {
            throw new NotFoundException(`No record found.`);
        }

        const updatedUsage = await this.databaseService.usageRecord.update({
            where: {
                id: usage.id,
            },
            data: {
                count: {
                    increment: 1
                }
            }
        });

        await this.cacheManager.del(`usage:getUsage:${organizationId}:${metric}`);       // removes old cached usage

        return updatedUsage;
    }

    async checkLimit(organizationId: string, metric: UsageMetric) {                      // checks usage limit
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

    async resetUsage(organizationId: string, metric: UsageMetric) {                     // resets usage and creates a new usage period
        const usage = await this.getUsage(organizationId, metric);                       // checks if the organization has used any of the metrics (API REQ, PROJECTS CREATED)

        if (!usage) {
            throw new NotFoundException(`Usage record not found.`);
        }

        const newPeriodStart = usage.periodEnd;                                         // sets up the new period of usage at the end of the last usage
        const newPeriodEnd = new Date(newPeriodStart);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);                             // sets up the end of the new usage period + 1 month of the period start

        const newUsage = await this.databaseService.usageRecord.create({                // creates the new usage record
            data: {
                organizationId,
                metric,
                count: 0,
                periodStart: newPeriodStart,
                periodEnd: newPeriodEnd
            }
        });

        await this.cacheManager.del(`usage:getUsage:${organizationId}:${metric}`);       // removes old cached usage

        return newUsage;
    }
}