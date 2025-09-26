import { IsNumber, IsDateString } from 'class-validator';

export class CreateTelemetryDto {
    @IsNumber()
    vehicleId: number;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    speed: number;

    @IsNumber()
    fuel: number;

    @IsDateString()
    timestamp: string;
}
