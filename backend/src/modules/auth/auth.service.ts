import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './dto/auth-reg.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService) { }

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
}
