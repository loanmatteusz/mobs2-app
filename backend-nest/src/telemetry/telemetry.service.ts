import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Telemetry } from './entities/telemetry.entity';
import { CreateTelemetryDto } from './dtos/create-telemetry.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';

@Injectable()
export class TelemetryService {
    private readonly logger = new Logger(TelemetryService.name);
    constructor (
        @InjectRepository(Telemetry)
        private telemetryRepository: Repository<Telemetry>,
    ) {}

    public async createTelemetry(dto: CreateTelemetryDto): Promise<Telemetry> {
        const telemetry = this.telemetryRepository.create(dto);
        return await this.telemetryRepository.save(telemetry);
    }

    public async getVehicleTelemetries(
        vehicleId: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResult<Telemetry>> {
        this.logger.log("get vehicle telemetris");
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
            lastPage: Math.ceil(total / limit),
        };
    }

    public async listLastVehiclesTelemetry(
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResult<Telemetry>> {
        this.logger.log('Listing latest telemetry per vehicle');

        const lastTimestamps = await this.telemetryRepository
            .createQueryBuilder('t')
            .select('t.vehicle_id', 'vehicle_id')
            .addSelect('MAX(t.timestamp)', 'last_timestamp')
            .groupBy('t.vehicle_id')
            .getRawMany();

        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        const recents = lastTimestamps.filter(t => new Date(t.last_timestamp) >= twoMinutesAgo);

        if (recents.length === 0) {
            return { data: [], total: 0, page, lastPage: 0 };
        }

        const vehicleIds = lastTimestamps.map(v => v.vehicle_id);
        const timestamps = lastTimestamps.map(v => v.last_timestamp);

        if (vehicleIds.length === 0) {
            return { data: [], total: 0, page, lastPage: 0 };
        }

        const [data, total] = await this.telemetryRepository.findAndCount({
            where: {
                vehicleId: In(vehicleIds),
                timestamp: In(timestamps),
            },
            order: { vehicleId: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
}
