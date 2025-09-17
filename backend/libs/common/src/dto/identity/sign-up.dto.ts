import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  middleName?: string;

  @IsString()
  @MaxLength(255)
  lastName: string;
}
