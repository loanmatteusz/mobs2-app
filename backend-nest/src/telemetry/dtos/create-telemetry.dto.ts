import { IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateTelemetryDto {
    @IsString()
    public vehicleId: string;

    @IsString()
    public vehiclePlate: string;

    @IsNumber()
    public latitude: number;

    @IsNumber()
    public longitude: number;

    @IsNumber()
    public speed: number;

    @IsNumber()
    public fuel: number;

    @IsDateString()
    public timestamp: string;
}
