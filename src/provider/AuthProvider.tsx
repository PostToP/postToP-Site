"use client";

import {useEffect, useState} from "react";
import AuthBackend from "@/utils/Backend/AuthBackend";
import {AuthContext, User} from "../context/AuthContext";

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<null | User>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = async (username: string, password: string) => {
        const login = await AuthBackend.login(username, password);
        if (!login.ok) {
            throw new Error(login.error);
        }

        localStorage.setItem("authToken", login.data.token);
        setUser(login.data.user);
    };

    const logout = async () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    const register = async (username: string, password: string, email: string) => {
        const register = await AuthBackend.register(username, password, email);
        if (!register.ok) {
            throw new Error(register.error);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            if (localStorage.getItem("user")) {
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                setUser(JSON.parse(localStorage.getItem("user")!));
                setLoading(false);
                return;
            }

            setLoading(false);
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return <AuthContext.Provider value={{user, login, logout, register, loading}}>{children}</AuthContext.Provider>;
}
