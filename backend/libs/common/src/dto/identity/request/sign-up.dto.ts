import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({ type: 'string', example: 'example@gmail.com'})
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: 'Tranquocanh@123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: 'Anh'})
  @IsString()
  @MaxLength(255)
  firstName: string;

  @ApiProperty({ type: 'string', example: 'Quoc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  middleName?: string;

  @ApiProperty({ type: 'string', example: 'Tran' })
  @IsString()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ type: 'string', example: 'bd35b66c-2fda-46d3-bccb-a09e6b9ef2b1' })
  @IsNotEmpty()
  deviceId: string;
}
