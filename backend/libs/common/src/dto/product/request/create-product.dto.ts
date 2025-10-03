import { IsString, IsOptional, IsNumber, IsBoolean, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ type: 'number', required: true })
  @IsNumber()
  @Min(0)
  availableStock: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
