import { Injectable, Inject } from '@nestjs/common';
import { UsageService } from '../usage/usage.service';
import { Plan } from '@prisma/client';
import Redis from 'ioredis';

@Injectable()
export class RateLimitService {
    constructor(private readonly usageService: UsageService, @Inject('REDIS_CLIENT') private redis: Redis) { }

    async checkLimit(orgId: string, plan: Plan) {
        const currentMinute = Math.floor(Date.now() / 60000);

        const key = `rate-limit:${orgId}:${currentMinute}`;

        const currentCount = await this.redis.get(key);

        const count = Number(currentCount ?? 0);

    }

}
