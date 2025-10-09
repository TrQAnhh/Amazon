import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  email: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  firstName: string;

  @ApiProperty({ type: 'string', required: false })
  @Expose()
  middleName?: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  lastName: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  address: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  bio?: string;
}
