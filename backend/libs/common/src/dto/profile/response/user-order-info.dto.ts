import {Expose} from "class-transformer";

export class UserOrderInfoResponseDto {
    @Expose()
    firstName: string;

    @Expose()
    middleName?: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    address: string;
}