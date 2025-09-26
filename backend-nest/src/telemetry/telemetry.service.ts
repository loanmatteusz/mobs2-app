import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telemetry } from './entities/telemetry.entity';
import { CreateTelemetryDto } from './dtos/create-telemetry.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';

@Injectable()
export class TelemetryService {
    
    constructor (
        @InjectRepository(Telemetry)
        private telemetryRepository: Repository<Telemetry>,
    ) {}

    public async createTelemetry(dto: CreateTelemetryDto): Promise<Telemetry> {
        const telemetry = this.telemetryRepository.create(dto);
        return await this.telemetryRepository.save(telemetry);
    }

    public async getVehicleTelemetries(
        vehicleId: number,
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResult<Telemetry>> {
        const [data, total] = await this.telemetryRepository.findAndCount({
            where: { vehicleId },
            order: { timestamp: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total/limit),
        };
    }
}
