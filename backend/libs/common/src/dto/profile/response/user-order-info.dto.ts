import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserOrderInfoResponseDto {
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
  email: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  address: string;
}
