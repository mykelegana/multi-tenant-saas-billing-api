import { Body, Controller, Post } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

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
    @Post('logout')
    async logout() { }
}
