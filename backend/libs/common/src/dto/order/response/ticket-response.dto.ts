import { DiscountStatus, DiscountType } from "@app/common/constants";
import {Expose} from "class-transformer";

export class TicketResponseDto {
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
    status: DiscountStatus;
}
