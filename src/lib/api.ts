import axios, { type InternalAxiosRequestConfig } from "axios";

export const api_v2 = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api_v2.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("_at");
        if (token) config.headers.set("Authorization", `Bearer ${token}`);
        return config;
    },
    (error) => Promise.reject(error),
);

api_v2.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return new Promise((resolve) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry && !["/refresh-token", "/login"].includes(originalRequest.url!)) {
                originalRequest._retry = true;
                const response = api_v2
                    .post("/refresh-token", {})
                    .then((res) => res.data)
                    .then((res) => {
                        localStorage.setItem("_at", res.accessToken);
                        originalRequest.headers.set("Authorization", `Bearer ${res.accessToken}`);
                        return api_v2(originalRequest);
                    })
                    .catch((err) => {
                        localStorage.removeItem("_at");
                        return Promise.reject(err);
                    });

                resolve(response);
            }
        });
    },
);
