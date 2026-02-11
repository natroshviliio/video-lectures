interface LoginProps {
    username: string;
    setUsername: (username: string) => void;
    password: string;
    setPassword: (password: string) => void;
    login: (e: React.SubmitEvent<HTMLFormElement>) => void;
    isLoginPending: boolean;
}

const Login = (props: LoginProps) => {
    const { username, setUsername, password, setPassword, login, isLoginPending } = props;

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
                        disabled={isLoginPending}
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
                        disabled={isLoginPending}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
                    disabled={isLoginPending}>
                    {isLoginPending ? (
                        <div className="flex items-center justify-center gap-x-3">
                            <span>Loading...</span>
                            <div className="w-6 h-6 animate-spin border-t-blue-200 border-4 rounded-full mr-2"></div>
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;
