import { Expose } from "class-transformer";
import {OrderItemResponseDto, UserOrderInfoResponseDto} from "@app/common/dto";

export class OrderResponseDto {
    @Expose()
    id: number;

    @Expose()
    totalAmount: number;

    @Expose()
    status: string;

    @Expose()
    paymentMethod: string;

    @Expose()
    paymentStatus: string;

    @Expose()
    orderInfo: UserOrderInfoResponseDto;

    @Expose()
    items: OrderItemResponseDto[];

    @Expose()
    createdAt: string;
}