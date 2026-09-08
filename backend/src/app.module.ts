import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { HealthModule } from './modules/health/health.module';
import { RedisModule } from './modules/redis/redis.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { UsageModule } from './modules/usage/usage.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager'
import KeyvRedis from '@keyv/redis';
import { UsageResetJobModule } from './modules/usage-reset-job/usage-reset-job.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, OrganizationsModule, HealthModule, RedisModule, InvitationsModule, MembershipsModule, SubscriptionsModule, WebhooksModule, UsageModule, ProjectsModule, UsageResetJobModule, RateLimitModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'redis',
        port: parseInt(process.env.REDIS_PORT ?? '6379')
      },
      defaultJobOptions: { attempts: 3 }
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        stores: [
          new KeyvRedis(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
        ],
        ttl: parseInt(process.env.REDIS_TTL!),
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService]
})
export class AppModule { }
