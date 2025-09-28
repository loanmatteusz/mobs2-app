import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { CreateTelemetryDto } from "./dtos/create-telemetry.dto";
import { TelemetryService } from "./telemetry.service";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { circularPathForFirstVehicle } from "src/mocks/path";

@Injectable()
export class TelemetrySeederService implements OnModuleInit {
    private readonly logger = new Logger(TelemetrySeederService.name);

    public pathIdx: number = 0;
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

    // @Interval(5000)
    // public async seedTelemetry() {
    //     if (this.vehicleIds.length === 0) return;

    //     if (this.pathIdx === (circularPathForFirstVehicle.length-1)) {
    //         this.pathIdx = 0;
    //     }
    //     console.log({ idx: this.pathIdx });

    //     const dto: CreateTelemetryDto = {
    //         vehicleId: this.vehicleIds[0],
    //         latitude: circularPathForFirstVehicle[this.pathIdx][0],
    //         longitude: circularPathForFirstVehicle[this.pathIdx][1],
    //         speed: parseFloat((Math.random() * 120).toFixed(1)),
    //         fuel: parseFloat((Math.random() * 100).toFixed(1)),
    //         timestamp: new Date().toISOString(),
    //     }

    //     this.pathIdx++;
    
    //     try {
    //         await this.telemetryService.createTelemetry(dto);
    //         this.logger.log(`Telemetry sent by vehicle ${this.vehicleIds[0]}`);
    //     } catch (err) {
    //         this.logger.error("Error to create telemetry", err);
    //     }
    // }

    private randomCoordinate(baseLat: number, baseLng: number, jitterMeters = 50) {
        const lat = baseLat + (Math.random() - 0.5) * (jitterMeters / 111000);
        const lng = baseLng + (Math.random() - 0.5) * (jitterMeters / (111000 * Math.cos(baseLat * Math.PI / 180)));
        return { lat, lng };
    }
}
