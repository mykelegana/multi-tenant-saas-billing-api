import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from 'src/database/database.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
    private prisma: DatabaseService
  ) { }


  // GET /health/database
  @Get('database')
  @HealthCheck()
  checkDb() {
    return this.health.check([
      () => this.db.pingCheck('database', this.prisma),
    ]);
  }

  @Get('redis')
  @HealthCheck()
  checkRedis() {
  }

  @Get('stripe')
  @HealthCheck()
  checkStripe() {
  }

  @Get('queue')
  @HealthCheck()
  checkQueue() {
  }
}
