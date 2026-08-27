import { Module } from '@nestjs/common';
import { UsageResetJobService } from './usage-reset-job.service';

@Module({
  providers: [UsageResetJobService]
})
export class UsageResetJobModule {}
