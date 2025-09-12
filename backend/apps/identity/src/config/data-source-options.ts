import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: true,
};

export default dataSourceOptions;
