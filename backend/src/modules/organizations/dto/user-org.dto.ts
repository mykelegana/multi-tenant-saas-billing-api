import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UserOrgDto {

    @IsEmail()
    @ApiProperty()
    email: string
}