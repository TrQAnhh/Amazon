import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { ProfileEntity } from '../entity/profile.identity';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_PROFILE_HOST,
  port: Number(process.env.MYSQL_PROFILE_PORT),
  database: process.env.MYSQL_PROFILE_DATABASE,
  username: process.env.MYSQL_PROFILE_USER,
  password: process.env.MYSQL_PROFILE_PASSWORD,
  entities: [ProfileEntity],
  migrations: [__dirname + '/../db/migrations/init/*.{ts,js}', __dirname + '/../db/migrations/dev/*.{ts,js}'],
  synchronize: false,
  migrationsRun: false,
};

export default dataSourceOptions;
