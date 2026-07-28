import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AuthLoginDto {

    @IsString()
    @IsEmail()
    @ApiProperty()
    email!: string;

    @IsString()
    @ApiProperty()
    password!: string;
}