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

type Register = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

type RegisterResponse = {
    user: any;
    access_token: string;
    token_type: string;
    expires_in: number;
}


export const authService = { 
    async login(data: Login): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("auth/login", data);
        return response.data;
    },

    async register(data: Register): Promise<RegisterResponse> {
        console.log({ data })
        const response = await api.post<RegisterResponse>("auth/register", data);
        return response.data;
    },
};
