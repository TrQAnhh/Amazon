import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductDetailDto {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  imageUrl: string;
}
