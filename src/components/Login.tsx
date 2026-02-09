import { useState } from "react";
import { api_v2 } from "../lib/api";

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

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await api_v2.post("/login", { username, password });
        const data = await response.data;
        onLoginSuccess(data.user);
        localStorage.setItem("_at", data.accessToken);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900">Sign In</h1>
                <p className="text-slate-500 mt-2 text-sm">Access your account securely</p>
            </div>

            <form onSubmit={login} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your.username"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6">
                    Sign In
                </button>
            </form>
        </div>
    );
}
