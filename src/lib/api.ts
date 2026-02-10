import axios, { type InternalAxiosRequestConfig } from "axios";
import { useUserStore } from "../store/userStore";

export const api_v1 = axios.create({
    baseURL: import.meta.env.VITE_API_V1_URL,
    withCredentials: true,
});

export const api_v2 = axios.create({
    baseURL: import.meta.env.VITE_API_V2_URL,
    withCredentials: true,
});

const handleAccessToken = async () => {
    const { data } = await api_v2.post("/rt");
    const { accessToken } = data;

    return { accessToken };
};

api_v2.interceptors.request.use(
    async (config) => {
        const at = useUserStore.getState().at;

        config.headers.set("Authorization", `Bearer ${at}`);
        config.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api_v2.interceptors.response.use(
    (response) => {
        if (response.config.url === "/logout") useUserStore.getState().setAccessToken(null);

        return response;
    },
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry && !["/rt", "/login"].includes(originalRequest.url!)) {
            originalRequest._retry = true;

            try {
                const { accessToken } = await handleAccessToken();
                originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

                useUserStore.getState().setAccessToken(accessToken);

                return api_v2(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    },
);
