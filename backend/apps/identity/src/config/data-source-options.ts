import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_IDENTITY_HOST,
    port: Number(process.env.MYSQL_IDENTITY_PORT),
    database: process.env.MYSQL_IDENTITY_DATABASE,
    username: process.env.MYSQL_IDENTITY_USER,
    password: process.env.MYSQL_IDENTITY_PASSWORD,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: true,
};

export default dataSourceOptions;
