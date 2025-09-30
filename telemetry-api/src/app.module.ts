import { Module } from '@nestjs/common';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<number>('DB_PORT', 5431)),
        username: config.get<string>('DB_USERNAME', 'mobs2'),
        password: config.get<string>('DB_PASSWORD', 'mobs2'),
        database: config.get<string>('DB_NAME', 'mobs2_telemetry'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ScheduleModule.forRoot(),
    TelemetryModule,
  ],
})
export class AppModule {}
