import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: number;

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
  availableStock: number;
}
