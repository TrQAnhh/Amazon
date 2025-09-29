import { Expose } from 'class-transformer';
import { OrderProductDetailDto } from "@app/common/dto";
import {ApiProperty} from "@nestjs/swagger";

export class OrderItemResponseDto {
    @ApiProperty({ type: 'number' })
    @Expose()
    productId: number;

    @ApiProperty({ type: 'number' })
    @Expose()
    quantity: number;

    @ApiProperty({ type: 'number' })
    @Expose()
    price: number;

    @ApiProperty({ type: 'number' })
    @Expose()
    total: number;

    @ApiProperty({ type: () => OrderProductDetailDto })
    @Expose()
    product: OrderProductDetailDto;
}
