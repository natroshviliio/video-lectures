import axios, { type InternalAxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

interface User {
    user_id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    birthdate: string;
    user_role: string;
    is_active: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("_at");
        if (token) config.headers.set("Authorization", `Bearer ${token}`);
        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return new Promise((resolve) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry && !["/refresh-token", "/login"].includes(originalRequest.url!)) {
                originalRequest._retry = true;
                const response = api
                    .post("/refresh-token", {})
                    .then((res) => res.data)
                    .then((res) => {
                        localStorage.setItem("_at", res.accessToken);
                        originalRequest.headers.set("Authorization", `Bearer ${res.accessToken}`);
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        localStorage.removeItem("_at");
                        return Promise.reject(err);
                    });

                resolve(response);
            }

            // return Promise.reject(error);
        });
    },
);

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const login = async () => {
        const response = await api.post("/login", { username, password });
        const data = await response.data;
        setUser(data.user);
        localStorage.setItem("_at", data.accessToken);
    };

    const logout = async () => {
        const response = await api.post("/logout");
        if (response.status >= 200 && response.status < 300) {
            setUser(null);
            localStorage.removeItem("_at");
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const response = await api.get("/me");
            const data = await response.data;

            setUser(data.user ?? null);
        };

        checkSession();
    }, []);

    return (
        <div className="flex flex-col gap-y-5 items-center">
            <div className="rounded-lg border border-neutral-100 shadow-md p-3 xl:w-1/5 w-[90%] mt-5 flex flex-col gap-y-3">
                <h1 className="font-bold text-2xl text-center">Sign in</h1>
                <input
                    type="text"
                    className="w-2/3 py-2 px-3 text-lg outline-none border border-neutral-300 rounded-md mx-auto"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="w-2/3 py-2 px-3 text-lg outline-none border border-neutral-300 rounded-md mx-auto"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="py-3 px-5 rounded-md text-white bg-emerald-500 w-fit mx-auto cursor-pointer" onClick={login}>
                    Sign in
                </button>
                <button className="py-3 px-5 rounded-md text-white bg-red-500 w-fit mx-auto cursor-pointer" onClick={logout}>
                    Sign out
                </button>
            </div>
            {user && (
                <div className="rounded-lg border border-neutral-100 shadow-md p-3 xl:w-1/5 w-[90%] mt-5 flex flex-col gap-y-3">
                    <h1 className="font-bold text-2xl text-center">User</h1>
                    <div>
                        full name: {user?.firstname} {user?.lastname}
                    </div>
                    <div>email: {user?.email}</div>
                </div>
            )}
        </div>
    );
}

export default App;
