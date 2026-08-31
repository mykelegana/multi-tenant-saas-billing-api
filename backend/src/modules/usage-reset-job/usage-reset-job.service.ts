import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UsageService } from '../usage/usage.service';

@Injectable()
export class UsageResetJobService {
    private readonly logger = new Logger(UsageResetJobService.name);

    constructor(@InjectQueue('usageReset') private readonly queue: Queue, private readonly usageService: UsageService) { }

    async scheduleUsageReset() {
        const job = await this.queue.add(
            'monthly-usage-reset-job',                // job name
            {},
            {
                jobId: 'monthly-usage-reset',         // job id
                attempts: 3,                          // attempts before failure
                backoff: {
                    type: 'exponential',              // time before each attempt
                    delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            },
        );

        this.logger.log(`Monthly usage reset job ${job.id} has been queued.`);       // log
        return job.id;
    }
}