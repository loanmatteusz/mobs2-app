import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { CreateTelemetryDto } from "./dtos/create-telemetry.dto";
import { TelemetryService } from "./telemetry.service";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { telemetryPaths } from "src/mocks/path";

@Injectable()
export class TelemetrySeederService implements OnModuleInit {
    private readonly logger = new Logger(TelemetrySeederService.name);

    public pathIdx: number = 0;
    private vehicleIds: string[] = [];

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
            this.vehicleIds = ['01999728-bcfa-7060-a49f-4e4fd2932c03'];
        }
    }

    @Interval(5000)
    public async seedTelemetry() {
        if (this.vehicleIds.length === 0) return;

        this.vehicleIds.forEach(async (vehicleId, idx) => {
            if (telemetryPaths[idx]) {
                const path = telemetryPaths[idx];
                if (!path) return;

                const localIndex = this.pathIdx % path.length;
                const coord = path[localIndex];

                const latitude = Array.isArray(coord) ? coord[0] : coord.lat;
                const longitude = Array.isArray(coord) ? coord[1] : coord.lng;
                
                const minSpeed = 55.0;
                const maxSpeed = 65.0;
                const speed = parseFloat((Math.random() * (maxSpeed - minSpeed) + minSpeed).toFixed(1));

                // console.log({ vehicleId, latitude, longitude });
                const dto: CreateTelemetryDto = {
                    vehicleId,
                    latitude,
                    longitude,
                    speed,
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
        });

        this.pathIdx++;
    }
}
