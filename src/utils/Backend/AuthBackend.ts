import { User } from "@/context/AuthContext";
import { Backend, type BackendResponse } from "./Backend";

export default class AuthBackend extends Backend {
    static async login(
        username: string,
        password: string,
    ): Promise<BackendResponse<{ token: string; user: User }>> {
        return AuthBackend.request(
            "POST",
            { username, password },
            "/auth",
        );
    }

    static async register(
        username: string,
        password: string,
    ): Promise<BackendResponse<{ token: string }>> {
        return AuthBackend.request(
            "POST",
            { username, password },
            "/register",
        );
    }

    static async getCurrentUser(): Promise<BackendResponse<{ user: User }>> {
        return {
            ok: true,
            data: {
                user: {
                    id: "1",
                    username: "demo_user",
                    handle: "demo_handle",
                }
            },
        }
    }
}