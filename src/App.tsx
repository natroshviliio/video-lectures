import { lazy, Suspense, useEffect, useState } from "react";
import { api_v1, api_v2 } from "./lib/api";
import { useUserStore } from "./store/userStore";
import Loading from "./components/Loading";

const Login = lazy(() => import("./components/Login"));

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginPending, setLoginPending] = useState(false);
    const [userLoaded, setUserLoaded] = useState<"loading" | "loaded" | "error">("loading");

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const login = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginPending(true);
        try {
            const response = await api_v1.post("/login", { username, password });
            const data = await response.data;
            setUser(data.user);
            setUserLoaded("loaded");
        } catch {
            setUserLoaded("error");
        } finally {
            setLoginPending(false);
        }
    };

    const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await api_v2.post("/logout");
        if (response.status >= 200 && response.status < 300) {
            setUser(null);
            setUserLoaded("error");
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            setUserLoaded("loading");
            try {
                const response = await api_v2.post("/rt");
                const { accessToken, user } = await response.data;

                useUserStore.getState().setAccessToken(accessToken);
                useUserStore.getState().setUser(user ?? null);

                setUser(user ?? null);
                setUserLoaded("loaded");
            } catch {
                setUser(null);
                setUserLoaded("error");
            } finally {
                console.clear();
            }
        };

        checkSession();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center flex-col p-4">
            <div className="w-full max-w-md">
                {userLoaded === "loading" && <Loading />}
                {userLoaded === "error" && !user && (
                    <Suspense fallback={<Loading />}>
                        <Login
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            login={login}
                            isLoginPending={isLoginPending}
                        />
                    </Suspense>
                )}
                {userLoaded === "loaded" && user && (
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
                                <p className={!!user.is_active === true ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                    {!!user.is_active === true ? "Active" : "Inactive"}
                                </p>
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
