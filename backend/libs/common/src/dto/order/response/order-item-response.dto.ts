import { Expose } from 'class-transformer';
import { OrderProductDetailDto } from "@app/common/dto";

export class OrderItemResponseDto {
    @Expose()
    productId: number;

    @Expose()
    quantity: number;

    @Expose()
    price: number;

    @Expose()
    total: number;

    @Expose()
    product: OrderProductDetailDto;
}
