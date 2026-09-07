import { Controller, Post } from '@nestjs/common';
import { UsageResetJobService } from './usage-reset-job.service';

@Controller('usage-reset')
export class UsageResetJobController {
    constructor(
        private readonly usageResetJobService: UsageResetJobService,
    ) { }

    @Post('test')
    async testReset() {
        return this.usageResetJobService.scheduleUsageReset();
    }
}