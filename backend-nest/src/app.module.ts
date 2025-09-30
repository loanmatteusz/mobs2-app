import { Module } from '@nestjs/common';
import { TelemetryModule } from './telemetry/telemetry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      username: 'mobs2',
      password: 'mobs2',
      database: 'mobs2_telemetry',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TelemetryModule,
  ],
})
export class AppModule {}
