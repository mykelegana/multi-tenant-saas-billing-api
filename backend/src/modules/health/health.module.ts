import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [HealthController],
  imports: [TerminusModule, HttpModule, DatabaseModule]
})
export class HealthModule { }
