import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, IsNotEmpty } from "class-validator";


export class CreateOrganizationDto {

    @IsString()
    @MaxLength(100, { message: 'Organization name cannot exceed 100 characters.' })
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @MaxLength(100, { message: 'Organization slug cannot exceed 72 characters.' })
    @ApiProperty()
    @IsNotEmpty()
    slug!: string;
}
