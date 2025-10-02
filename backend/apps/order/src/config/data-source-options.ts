import { OrderItemEntity } from '../entity/order-items.entity';
import { DiscountTicketEntity } from "../entity/discount-ticket.entity";
import { UserTicketEntity } from "../entity/user-ticket.entity";
import { OrderTicketEntity } from "../entity/order-ticket.entity";
import { OrderEntity } from '../entity/order.entity';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_ORDER_HOST,
  port: Number(process.env.MYSQL_ORDER_PORT),
  database: process.env.MYSQL_ORDER_DATABASE,
  username: process.env.MYSQL_ORDER_USER,
  password: process.env.MYSQL_ORDER_PASSWORD,
  entities: [OrderEntity, OrderItemEntity, DiscountTicketEntity, UserTicketEntity, OrderTicketEntity],
  migrations: [__dirname + '/../db/migrations/init/*.{ts,js}', __dirname + '/../db/migrations/dev/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
};

export default dataSourceOptions;
