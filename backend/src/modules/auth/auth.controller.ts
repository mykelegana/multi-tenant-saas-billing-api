import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // POST /auth/register
    @Post('register')
    async register(@Body() authRegisterDto: AuthRegisterDto) {
        return this.authService.register(authRegisterDto);
    }

    // POST /auth/login
    @Post('login')
    async login(@Body() authLoginDto: AuthLoginDto) {
        return this.authService.login(authLoginDto);
    }

    // POST /auth/logout
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req) {
        return req.logout()
    }

    @UseGuards(JwtAuthGuard)
    @Get('token-info')
    async info(@Req() req) {
        return req.user
    }
}
