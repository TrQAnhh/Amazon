import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsDateString, MaxLength, Min } from 'class-validator';
import { DiscountType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({ type: 'number', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @ApiProperty({ type: 'string' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: 'string' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @Min(1)
  total: number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @Min(1)
  usageLimit: number;
}
