import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {

    @IsString()
    @IsEmail()
    @ApiProperty()
    @IsNotEmpty()
    email!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name!: string
}