import { Expose } from "class-transformer";
import {OrderItemResponseDto, UserOrderInfoResponseDto} from "@app/common/dto";
import {ApiProperty} from "@nestjs/swagger";

export class OrderResponseDto {
    @ApiProperty({ type: 'number' })
    @Expose()
    id: number;

    @ApiProperty({ type: 'number' })
    @Expose()
    totalAmount: number;

    @ApiProperty({ type: 'string' })
    @Expose()
    status: string;

    @ApiProperty({ type: 'string' })
    @Expose()
    paymentMethod: string;

    @ApiProperty({ type: 'string' })
    @Expose()
    paymentStatus: string;

    @ApiProperty({ type: () => UserOrderInfoResponseDto })
    @Expose()
    orderInfo: UserOrderInfoResponseDto;

    @ApiProperty({ type: () => [OrderItemResponseDto] })
    @Expose()
    items: OrderItemResponseDto[];

    @ApiProperty({ type: 'string' })
    @Expose()
    createdAt: string;

    @ApiProperty({ type: 'string' })
    @Expose()
    checkoutUrl?: string;
}