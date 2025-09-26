import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { CreateTelemetryDto } from "./dtos/create-telemetry.dto";
import { TelemetryService } from "./telemetry.service";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TelemetrySeederService implements OnModuleInit {
    private readonly logger = new Logger(TelemetrySeederService.name);

    private vehicleIds: number[] = [];

    constructor(
        private readonly telemetryService: TelemetryService,
        private readonly configService: ConfigService,
    ) { }

    public async onModuleInit() {
        await this.loadVehicleIds();
    }

    private async loadVehicleIds() {
        try{
            const laravelUrl = this.configService.get<string>('LARAVEL_BASE_URL');
            const secret = this.configService.get<string>('INTERNAL_API_SECRET');
            const response = await axios.get(`${laravelUrl}/api/internal/vehicles?secret=${secret}`, {
                headers: {
                    Accept: 'application/json',
                }
            });
            this.vehicleIds = response.data.map((v: any) => v.id);
            this.logger.log(`Vehicle IDs loaded: ${this.vehicleIds.join(', ')}`);
        } catch(err) {
            this.logger.error('Error to find vehicleIds of Laravel API', err.message);
            this.vehicleIds = [1];
        }
    }

    @Interval(5000)
    public async seedTelemetry() {
        if (this.vehicleIds.length === 0) return;

        for (const vehicleId of this.vehicleIds) {
            const dto: CreateTelemetryDto = {
                vehicleId,
                latitude: this.randomCoordinate(-23.55),
                longitude: this.randomCoordinate(-46.63),
                speed: parseFloat((Math.random() * 120).toFixed(1)),
                fuel: parseFloat((Math.random() * 100).toFixed(1)),
                timestamp: new Date().toISOString(),
            }
    
            try {
                await this.telemetryService.createTelemetry(dto);
                this.logger.log(`Telemetry sent by vehicle ${vehicleId}`);
            } catch (err) {
                this.logger.error("Error to create telemetry", err);
            }
        }
    }

    private randomCoordinate(base: number, jitterMeters = 50) {
        return base + (Math.random() - 0.5) * (jitterMeters / 111000);
    }
}
