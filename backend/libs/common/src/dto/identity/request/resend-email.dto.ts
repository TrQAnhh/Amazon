import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResendEmailDto {
    @ApiProperty({ type: 'email' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}