import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UsageService } from '../usage/usage.service';
import { UsageMetric } from '@prisma/client';

@Injectable()
export class UsageResetJobService {
    private readonly logger = new Logger(UsageResetJobService.name);

    constructor(@InjectQueue('usageReset') private readonly queue: Queue, private readonly usageService: UsageService) { }

    async scheduleUsageReset() {
        await this.queue.add('monthly-usage-reset', {})
    }
}