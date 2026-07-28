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
import Redis from 'ioredis';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, OrganizationsModule, HealthModule, RedisModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, DatabaseService]
})
export class AppModule { }
