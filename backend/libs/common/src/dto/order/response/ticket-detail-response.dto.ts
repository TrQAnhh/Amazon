import { Expose } from 'class-transformer';
import { DiscountStatus, DiscountType } from '@app/common/constants';

export class TicketDetailResponseDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  type: DiscountType;

  @Expose()
  value?: number;

  @Expose()
  minOrderAmount?: number;

  @Expose()
  maxDiscount?: number;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  total: number;

  @Expose()
  usageLimit: number;

  @Expose()
  status: DiscountStatus;
}
