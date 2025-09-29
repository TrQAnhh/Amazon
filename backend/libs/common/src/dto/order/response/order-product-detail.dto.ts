import { Expose } from "class-transformer";

export class OrderProductDetailDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    imageUrl: string;
}