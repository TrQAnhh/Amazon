import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableStock?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
