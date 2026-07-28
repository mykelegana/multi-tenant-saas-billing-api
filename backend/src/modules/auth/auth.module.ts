import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenDenylistService } from './token-denylist.service';

@Module({
  providers: [AuthService, JwtStrategy, TokenDenylistService],
  controllers: [AuthController],
  imports: [DatabaseModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' }
  })]
})
export class AuthModule { }
