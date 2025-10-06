import { TicketController } from './ticket.controller';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/common';
import process from 'node:process';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICE_NAMES.ORDER,
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_SERVICE_HOST,
          port: Number(process.env.ORDER_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [TicketController],
  providers: [],
})
export class TicketModule {}
