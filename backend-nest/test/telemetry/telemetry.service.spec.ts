import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from '../../src/telemetry/telemetry.service';

describe('TelemetryService', () => {
  let service: TelemetryService;

//  const data: TelemetryData = {
//    vehicleId,
//    latitude: Math.random() * 180 - 90,
//    longitude: Math.random() * 360 - 180,
//    speed: Math.random() * 100,
//    fuel: Math.random() * 100,
//    timestamp: new Date(),
//  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryService],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
