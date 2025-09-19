import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ProductEntity } from '../entity/product.entity';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_PRODUCT_HOST,
  port: Number(process.env.MYSQL_PRODUCT_PORT),
  database: process.env.MYSQL_PRODUCT_DATABASE,
  username: process.env.MYSQL_PRODUCT_USER,
  password: process.env.MYSQL_PRODUCT_PASSWORD,
  entities: [ProductEntity],
  migrations: [__dirname + '/../db/migrations/init/*.{ts,js}', __dirname + '/../db/migrations/dev/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
};

export default dataSourceOptions;
