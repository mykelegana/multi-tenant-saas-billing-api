import { Body, Controller, Post } from '@nestjs/common';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // POST /register
    @Post('register')
    async register(@Body() authRegisterDto: AuthRegisterDto) {
        return this.authService.register(authRegisterDto);
    }
}
