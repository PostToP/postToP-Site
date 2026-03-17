import {User} from "@/context/AuthContext";
import {Backend, type BackendResponse} from "./Backend";

export interface ServerStats {
    status: string;
    data: Data;
}

export interface Data {
    activeUsers: number;
    connectedUsers: number;
    musicVideos: string;
    musicArtists: string;
    totalListenedHours: number;
}

export default class ServerBackend extends Backend {
    static async getStats(): Promise<BackendResponse<ServerStats>> {
        return ServerBackend.GET("/stats");
    }
}
