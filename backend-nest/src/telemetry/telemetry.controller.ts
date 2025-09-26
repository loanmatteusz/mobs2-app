import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dtos/create-telemetry.dto';
import { PaginationDto } from './dtos/pagination.dto';


@Controller('telemetry')
export class TelemetryController {
    constructor (
        private readonly telemetryService: TelemetryService,
    ) {}

    @Get(':vehicleId')
    public list(@Param('vehicleId') vehicleId: number, @Query() paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        return this.telemetryService.getVehicleTelemetries(vehicleId, page, limit);
    }

    @Post()
    public create(@Body() dto: CreateTelemetryDto) {
        return this.telemetryService.createTelemetry(dto);
    }
}
