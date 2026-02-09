import axios, { type InternalAxiosRequestConfig } from "axios";

export const api_v2 = axios.create({
    baseURL: import.meta.env.VITE_API_V2_URL,
    withCredentials: true,
});

export const api_v1 = axios.create({
    baseURL: import.meta.env.VITE_API_V1_URL,
});

api_v2.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("_at");
        if (token) config.headers.set("Authorization", `Bearer ${token}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api_v2.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry && !["/rt", "/login"].includes(originalRequest.url!)) {
            originalRequest._retry = true;

            try {
                const { data } = await api_v2.post("/rt");
                localStorage.setItem("_at", data.accessToken);
                originalRequest.headers.set("Authorization", `Bearer ${data.accessToken}`);

                return api_v2(originalRequest);
            } catch (err) {
                localStorage.removeItem("_at");
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    },
);
