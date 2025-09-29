import { IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ type: 'string', example: 'eyJhbGciIUzI1R5cCI6IVCJ9.eyJzdIxNzU5NzMzMTI2fQ.zSKkmI8L89MmcIcSIY' })
  @IsString()
  refreshToken: string;
}
