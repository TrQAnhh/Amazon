import { ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CollectTicketDto {
    @ApiProperty({ type : 'number' })
    @ArrayNotEmpty()
    ticketId: number;
}
