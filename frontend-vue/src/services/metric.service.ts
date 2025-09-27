import { api } from "./api";

export interface EpiMetricsResponse {
    total: number;
    expired: number;
    byCategory: Record<string, number>;
}

export const metricsService = {
    async get(): Promise<EpiMetricsResponse> {
        const response = await api.get("/metrics");
        return response.data;
    },
};
