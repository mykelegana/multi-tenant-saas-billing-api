import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {

    @IsString()
    @ApiProperty()
    email!: string;

    @ApiProperty()
    @IsString()
    password!: string;

    @ApiProperty()
    @IsString()
    name!: string
}