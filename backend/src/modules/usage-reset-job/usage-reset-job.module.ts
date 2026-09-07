import { Module } from '@nestjs/common';
import { UsageResetJobService } from './usage-reset-job.service';
import { UsageResetProcessor } from './processors/usage-reset.processor';
import { BullModule } from '@nestjs/bullmq';
import { UsageModule } from '../usage/usage.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsageResetJobController } from './usage-reset-job.controller';

@Module({
  imports: [BullModule.registerQueue({
    name: 'usageReset'
  }),
    UsageModule,
    DatabaseModule
  ],
  providers: [UsageResetJobService, UsageResetProcessor],
  controllers: [UsageResetJobController],
  exports: [UsageResetJobService]
})
export class UsageResetJobModule { }
