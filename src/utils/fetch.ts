export class FetchBackend {
    static _server: string = process.env.NEXT_PUBLIC_SERVER || "http://localhost:8000";

    static async post(url: string, body: any) {
        const fullUrl = `${FetchBackend._server}${url}`;
        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        const res = await fetch(fullUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`Failed to post to ${fullUrl}: ${res.statusText}`);
        }

        return res.json();
    }

    static async get(url: string, params?: Record<string, string>) {
        let fullUrl = `${FetchBackend._server}${url}`;
        if (params) {
            const queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        }
        const token = localStorage.getItem("authToken");
        const headers: Record<string, string> = {};

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        const res = await fetch(fullUrl, {
            method: "GET",
            headers: headers,
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch ${fullUrl}: ${res.statusText}`);
        }

        return res.json();
    }
}