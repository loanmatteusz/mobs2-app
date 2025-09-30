import { Telemetry } from "@/types/telemetry";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});


type Params = {
    page?: number;
    limit?: number;
}

type PaginatedResult = {
    data: Telemetry[],
    total: number;
    page: number,
    lastPage: number,
}

export const telemetryService = {
    async getAll(vehicleId: number, params?: Params): Promise<PaginatedResult> {
        const response = await api.get(`/telemetry/${vehicleId}`, { params });
        return response.data;
    },

    async getLastByVehicleId(vehicleId: number): Promise<PaginatedResult> {
        const response = await api.get(`/telemetry/${vehicleId}`, { params: { limit: 1} });
        return response.data;
    },

    async lastestVehicleTelemetry(params?: Params): Promise<PaginatedResult> {
        const response = await api.get(`/telemetry/lastest`, { params });
        return response.data;
    },
};
