import { api } from "./api";

type Login = {
    email: string;
    password: string;
}

type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export const authService = { 
    async login(data: Login): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/login", data);
        return response.data;
    },
};
