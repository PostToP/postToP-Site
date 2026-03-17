import {useEffect, useState} from "react";
import {PolarAngleAxis, PolarGrid, Radar, RadarChart} from "recharts";
import UserBackend from "@/utils/Backend/UserBackend";
import {DateRange} from "../Misc/DateSelector";

export interface TopGenre {
    genre_name: string;
    listen_count: string;
}

export default function TopGenreRadarChart({
    user_handle,
    dateRange,
}: {
    user_handle: string;
    dateRange: DateRange | null;
}) {
    const [topGenres, setTopGenres] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTopGenres() {
            const response = await UserBackend.getUserTopGenres(user_handle, {
                startDate: dateRange?.startDate.toISOString() ?? undefined,
                endDate: dateRange?.endDate.toISOString() ?? undefined,
            });
            if (response.ok) {
                response.data = response.data.map((genre: TopGenre) => {
                    genre.genre_name = genre.genre_name
                        .replace("https://en.wikipedia.org/wiki/", "")
                        .replace(/_/g, " ");
                    return genre;
                });
                response.data = response.data.filter(i => i.genre_name !== "Music");
                setTopGenres(response.data);
            } else {
                console.error("Failed to fetch top genres:", response.error);
            }
        }

        fetchTopGenres();
    }, [user_handle, dateRange]);

    return (
        <>
            <RadarChart
                style={{width: "100%", height: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 1}}
                responsive
                outerRadius="80%"
                data={topGenres}
                margin={{
                    top: 50,
                    left: 50,
                    right: 50,
                    bottom: 50,
                }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="genre_name" />
                <Radar dataKey="listen_count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </>
    );
}
