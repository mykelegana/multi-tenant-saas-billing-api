import {
    Injectable,
    Inject,
} from '@nestjs/common';
import { UsageService } from '../usage/usage.service';
import { Plan, UsageMetric } from '@prisma/client';
import Redis from 'ioredis';
import { PLAN_LIMITS } from 'src/common/constants/plan-limits';

@Injectable()
export class RateLimitService {
    constructor(
        private readonly usageService: UsageService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }

    async checkLimit(orgId: string, plan: Plan) {
        // Current 1-minute window
        const currentMinute = Math.floor(Date.now() / 60000);

        // Organization-specific Redis key
        const key = `rate-limit:${orgId}:${currentMinute}`;

        // Get current requests in this minute
        const currentCount = await this.redis.get(key);

        const count = Number(currentCount ?? 0);

        // Get limits for the organization's plan
        const reqPerMin = PLAN_LIMITS[plan].REQUESTS_PER_MINUTE;

        const overallReqLimit = PLAN_LIMITS[plan].API_REQUESTS;

        // Check per-minute rate limit
        if (count >= reqPerMin) {
            throw new Error('Rate limit exceeded. Try again later.');
        }

        // Check monthly API request usage
        const usage = await this.usageService.getUsage(
            orgId,
            UsageMetric.API_REQUESTS,
        );

        const monthlyUsage = usage?.count ?? 0;

        if (monthlyUsage >= overallReqLimit) {
            throw new Error('Monthly API request limit exceeded.',);
        }

        // Increment Redis request counter
        const newCount = await this.redis.incr(key);

        // Expire the key after 60 seconds
        if (newCount === 1) {
            await this.redis.expire(key, 60);
        }

        return {
            allowed: true,
            currentMinuteRequests: newCount,
            requestsPerMinuteLimit: reqPerMin,
            monthlyRequests: monthlyUsage,
            monthlyRequestsLimit: overallReqLimit,
        };
    }
}