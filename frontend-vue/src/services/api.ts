import axios from "axios";

export const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzU5MDAyMzcxLCJleHAiOjE3NTkwMDU5NzEsIm5iZiI6MTc1OTAwMjM3MSwianRpIjoicWozYmY2cTQ4S09IWjdPYiIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.DqzoTf507HigfBMVvdJBqLL4Bqc7heqYAYIkji_NUpA",
    },
});
