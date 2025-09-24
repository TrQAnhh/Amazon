import { Expose } from "class-transformer";
import { OrderItemResponseDto } from "@app/common/dto";

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
    items: OrderItemResponseDto[];

    @Expose()
    createdAt: string;
}