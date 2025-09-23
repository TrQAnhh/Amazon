import { DataSourceOptions } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';
import { OrderItemEntity } from '../entity/order-items.entity';
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
  entities: [OrderEntity, OrderItemEntity],
  migrations: [__dirname + '/../db/migrations/init/*.{ts,js}', __dirname + '/../db/migrations/dev/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
};

export default dataSourceOptions;
