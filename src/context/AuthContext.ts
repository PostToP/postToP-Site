import {createContext} from "react";

export interface User {
    id: string;
    username: string;
    handle: string;
    email: string;
    role: "User" | "Admin";
}

export const AuthContext = createContext<{
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string, email: string) => Promise<void>;
    setUser: (user: User | null) => void;
}>({
    user: null,
    loading: true,
    login: async () => {
        console.log("login function not implemented");
    },
    logout: async () => {
        console.log("logout function not implemented");
    },
    register: async () => {
        console.log("register function not implemented");
    },
    setUser: () => {
        console.log("setUser function not implemented");
    },
});
