import { create } from "zustand";

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

interface AuthState {
    at: string | null;
    user: User | null;
    setAccessToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<AuthState>((set) => ({
    at: null,
    user: null,
    setAccessToken: (token: string | null) => set({ at: token }),
    setUser: (user: User | null) => set({ user }),
}));
