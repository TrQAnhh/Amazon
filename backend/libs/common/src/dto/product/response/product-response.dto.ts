import { Expose } from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty({ type: 'number' })
  @Expose()
  id: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  sku: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  description: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  imageUrl: string;

  @ApiProperty({ type: 'number' })
  @Expose()
  price: number;

  @ApiProperty({ type: 'number' })
  @Expose()
  availableStock: number;
}
