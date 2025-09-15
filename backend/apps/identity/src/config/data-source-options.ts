import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import {IdentityEntity} from "../entity/identity.entity";
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_IDENTITY_HOST,
    port: Number(process.env.MYSQL_IDENTITY_PORT),
    database: process.env.MYSQL_IDENTITY_DATABASE,
    username: process.env.MYSQL_IDENTITY_USER,
    password: process.env.MYSQL_IDENTITY_PASSWORD,
    entities: [IdentityEntity],
    migrations: [__dirname + '/../db/migrations/*.{ts,js}'],
    synchronize: false,
    migrationsRun: false,
};

export default dataSourceOptions;
