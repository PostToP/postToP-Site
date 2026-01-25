"use client";

import AuthBackend from "@/utils/Backend/AuthBackend";
import { useEffect, useState } from "react";
import { AuthContext, User } from "../context/AuthContext";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
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

    const register = async (
        username: string,
        password: string,
    ) => {
        const register = await AuthBackend.register(username, password);
        if (!register.ok) {
            throw new Error(register.error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            AuthBackend.getCurrentUser()
                .then((res) => {
                    if (res.ok) {
                        setUser(res.data.user);
                        setLoading(false);
                    } else {
                        localStorage.removeItem("authToken");
                        setLoading(false);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("authToken");
                });
        } else {
            setLoading(false);
        }
    }, []);

    return <AuthContext.Provider value={{ user, login, logout, register, loading }}>
        {children}
    </AuthContext.Provider>

}