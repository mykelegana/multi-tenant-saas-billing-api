import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [DatabaseModule]
})
export class AuthModule { }
