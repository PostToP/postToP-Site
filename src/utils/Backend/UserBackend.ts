import { User } from "@/context/AuthContext";
import { Backend, type BackendResponse } from "./Backend";

export default class UserBackend extends Backend {
    static async getUserTopMusic(handle: string, filters: Partial<{ startDate: string; endDate: string }> = {}): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "music",
            ...filters,
        });
    }

    static async getUserTopArtists(handle: string, filters: Partial<{ startDate: string; endDate: string }> = {}): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "artist",
            ...filters
        });
    }

    static async getUserTopGenres(handle: string, filters: Partial<{ startDate: string; endDate: string }> = {}): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(`/user/${handle}/top`, {
            type: "genre",
            ...filters
        });
    }

    static async getListenHistory(user_handle: string, limit = 50, offset = 0): Promise<BackendResponse<any[]>> {
        return UserBackend.GET(
            `/user/${user_handle}/history`,
            {
                limit: limit,
                offset: offset,
            }
        );
    }

    static async getUserStats(user_handle: string, filters: Partial<{ startDate: string; endDate: string }> = {}): Promise<BackendResponse<any>> {
        return UserBackend.GET(
            `/user/${user_handle}/stats`
            , filters
        );
    }

    static async getUserInfo(user_handle: string): Promise<BackendResponse<User>> {
        return UserBackend.GET(
            `/user/${user_handle}`
        );
    }
}
