import { Expose } from 'class-transformer';

export class OrderProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  availableStock: number;
}
