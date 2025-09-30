import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telemetry } from './entities/telemetry.entity';
import { TelemetrySeederService } from './telemetry-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Telemetry])],
  controllers: [TelemetryController],
  providers: [TelemetryService, TelemetrySeederService],
})
export class TelemetryModule {}
