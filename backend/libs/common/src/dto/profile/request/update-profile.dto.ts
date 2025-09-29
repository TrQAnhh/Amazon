import { IsOptional, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UpdateProfileDto {

  @ApiProperty({ type: 'string', example: 'Anh', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ type: 'string', example: 'Quoc', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ type: 'string', example: 'Tran', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: 'string', example: 'Ho Chi Minh City', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: 'string', example: 'you can call me QuocAnh', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
