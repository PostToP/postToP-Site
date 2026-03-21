import {User} from "@/context/AuthContext";
import {Backend, type BackendResponse} from "./Backend";

export type UserUpdatePayload = Partial<{
    email: string;
    displayName: string;
    handle: string;
    currentPassword: string;
    newPassword: string;
}>;

export type UserProfile = User & {
    email?: string;
    mail?: string;
    displayName?: string;
    display_name?: string;
    created_at?: string;
};

export default class UserBackend extends Backend {
    static async getUserTopMusic(
        handle: string,
        filters: Partial<{startDate: string; endDate: string; limit: number; offset: number}> = {},
    ): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "music",
            ...filters,
        });
    }

    static async getUserTopArtists(
        handle: string,
        filters: Partial<{startDate: string; endDate: string; limit: number; offset: number}> = {},
    ): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "artist",
            ...filters,
        });
    }

    static async getUserTopGenres(
        handle: string,
        filters: Partial<{startDate: string; endDate: string; limit: number; offset: number}> = {},
    ): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "genre",
            ...filters,
        });
    }

    static async getListenHistory(user_handle: string, limit = 50, offset = 0): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${user_handle}/history`, {
            limit: limit,
            offset: offset,
        });
    }

    static async getUserStats(
        user_handle: string,
        filters: Partial<{startDate: string; endDate: string}> = {},
    ): Promise<BackendResponse<any>> {
        return UserBackend.GET(`/user/${user_handle}/stats`, filters);
    }

    static async getUserInfo(user_handle: string): Promise<BackendResponse<UserProfile>> {
        return UserBackend.GET(`/user/${user_handle}`);
    }

    static async updateUserInfo(
        user_handle: string,
        updates: UserUpdatePayload,
    ): Promise<BackendResponse<UserProfile>> {
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined && value !== ""),
        );

        return UserBackend.PUT(`/user/${user_handle}`, filteredUpdates);
    }

    static async deleteUserAccount(user_handle: string): Promise<BackendResponse<null>> {
        return UserBackend.DELETE(`/user/${user_handle}`);
    }
}
