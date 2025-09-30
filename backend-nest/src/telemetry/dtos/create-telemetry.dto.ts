import { IsNumber, IsDateString } from 'class-validator';

export class CreateTelemetryDto {
    @IsNumber()
    vehicleId: string;

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
