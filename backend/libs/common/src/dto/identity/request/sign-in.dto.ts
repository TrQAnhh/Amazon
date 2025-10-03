import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ type: 'string', example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: 'Tranquocanh@123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: 'bd35b66c-2fda-46d3-bccb-a09e6b9ef2b1' })
  @IsNotEmpty()
  deviceId: string;
}
