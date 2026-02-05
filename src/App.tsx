import axios from "axios";
import { useState } from "react";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const response = await api.post("/login", { username, password });
        console.log(await response.data);
    };

    return (
        <div className="flex justify-center">
            <div className="rounded-lg border border-neutral-100 shadow-md p-3 w-1/5 mt-5 flex flex-col gap-y-3">
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
            </div>
        </div>
    );
}

export default App;
