import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsIn, IsNotEmpty } from "class-validator";


export class CreateInvitationDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email!: string;

    @IsIn([Role.ADMIN, Role.MEMBER], { message: `Role must be either 'ADMIN' or 'MEMBER'` })
    role!: Role
}
