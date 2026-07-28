import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenDenylistService } from './token-denylist.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private tokenDenylistService: TokenDenylistService) { }

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
        const { jwtId, exp } = req.user; // pull from decoded JWT payload
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await this.tokenDenylistService.revoke(jwtId, ttl);
        }
        return { message: 'Logged out successfully' };
    }

    // GET /auth/token-info
    @UseGuards(JwtAuthGuard)
    @Get('token-info')
    async info(@Req() req) {
        return req.user
    }
}
