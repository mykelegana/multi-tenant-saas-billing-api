import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { UsageService } from "src/modules/usage/usage.service";
import { DatabaseService } from "src/database/database.service";

@Processor('usageReset')
export class UsageResetProcessor extends WorkerHost {
    private readonly logger = new Logger(UsageResetProcessor.name);

    constructor(
        private readonly usageService: UsageService,
        private readonly databaseService: DatabaseService,
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        try {
            const expiredUsage = await this.databaseService.usageRecord.findMany({      // find periodEnds in the usage records where the date is less than
                where: {                                                               // or equal to the current Date
                    periodEnd: {
                        lte: new Date(),
                    },
                },
            });

            for (const usage of expiredUsage) {                                     // for each org it runs the function reset usage which resets the org's usage in both metrics
                await this.usageService.resetUsage(
                    usage.organizationId,
                    usage.metric,
                );
            }

            this.logger.log(`Successfully processed ${expiredUsage.length} expired usage records.`,);
        } catch (error) {
            this.logger.error(`Failed to reset usage`, error);
            throw error;
        }
    }
}