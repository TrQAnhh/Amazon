import { Expose } from 'class-transformer';

export class OrderProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}
