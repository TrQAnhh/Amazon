import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  name: string;

  @Expose()
  sku: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}
