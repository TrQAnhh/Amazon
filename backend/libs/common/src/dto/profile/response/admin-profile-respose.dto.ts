import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AdminProfileResponseDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  email: string;

  @ApiProperty({ type: 'number' })
  @Expose()
  userId: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  firstName: string;

  @ApiProperty({ type: 'string' })
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
