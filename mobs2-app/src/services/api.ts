import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: `${apiUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
