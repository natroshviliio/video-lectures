import { useEffect, useState } from "react";
import { api_v2 } from "./lib/api";

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

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await api_v2.post("/login", { username, password });
        const data = await response.data;
        setUser(data.user);
        localStorage.setItem("_at", data.accessToken);
    };

    const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await api_v2.post("/logout");
        if (response.status >= 200 && response.status < 300) {
            setUser(null);
            localStorage.removeItem("_at");
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const response = await api_v2.get("/me");
            const data = await response.data;

            setUser(data.user ?? null);
        };

        checkSession();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {!user ? (
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
                ) : (
                    <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">{user.firstname.charAt(0)}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                {user.firstname} {user.lastname}
                            </h2>
                            <p className="text-slate-500 text-sm">{user.email}</p>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3 text-left">
                            <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase">User ID</p>
                                <p className="text-slate-900">{user.user_id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase">Username</p>
                                <p className="text-slate-900">{user.username}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase">Birth Date</p>
                                <p className="text-slate-900">{new Date(user.birthdate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase">Role</p>
                                <p className="text-slate-900 capitalize">{user.user_role}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                                <p className={user.is_active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{user.is_active}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition duration-200">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
