import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

type loginPayload = {
    id: string,
    email: string,
    access_token: string
}

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService, private jwtService: JwtService) { }

    // /register endpoint service
    async register(authRegisterDto: AuthRegisterDto) {
        const hashedPass = await bcrypt.hash(authRegisterDto.password, 10);
        const checkEmail = await this.databaseService.user.findFirst({
            where: {
                email: authRegisterDto.email
            }
        });
        if (checkEmail) {
            throw new ConflictException('This email address is already owned by someone. Please use another email.')
        }

        const regNewUser = await this.databaseService.user.create({
            data: {
                email: authRegisterDto.email,
                password: hashedPass,
                name: authRegisterDto.name
            }
        });
        return regNewUser;
    }

    // /login endpoint service
    async login(authLoginDto: AuthLoginDto): Promise<loginPayload | null> {
        const user = await this.databaseService.user.findFirst({
            where: {
                email: authLoginDto.email
            }
        });
        if (!user) {
            throw new NotFoundException(`User with email ${authLoginDto.email} not found.`);
        }

        const checkPass = await bcrypt.compare(authLoginDto.password, user.password);
        if (!checkPass) {
            throw new UnauthorizedException(`Wrong password. Please enter the correct one for this user.`);
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        }

        return {
            id: user.id,
            email: user.email,
            access_token: this.jwtService.sign(payload)
        };
    }

    // /logout endpoint service

}
