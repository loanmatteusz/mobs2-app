import type { Vehicle } from "@/types/vehicle";
import { api } from "./api";

type Params = {
    page?: number;
    limit?: number;
    brand?: string;
    model?: string;
    plate?: string;
    year?: number;
}

type PaginatedResult = {
    data: Vehicle[],
    total: number;
}

export const vehicleService = { 
    async getAll(params?: Params): Promise<PaginatedResult> {
        const response = await api.get("/vehicles", { params });
        return response.data;
    },

    async getById(id: string): Promise<Vehicle> {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    },

    async create(epi: Partial<Vehicle>): Promise<Vehicle> {
        const response = await api.post("/vehicles", epi);
        return response.data;
    },

    async update(id: string, epi: Partial<Vehicle>): Promise<Vehicle> {
        const response = await api.put(`/vehicles/${id}`, epi);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/vehicles/${id}`);
    },
};
