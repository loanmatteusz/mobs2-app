import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5431,
    username: 'mobs2',
    password: 'mobs2',
    database: 'mobs2_telemetry',
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
});
