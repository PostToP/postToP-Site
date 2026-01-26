import UserBackend from "@/utils/Backend/UserBackend";
import { useEffect, useState } from "react";
import ArtistCard from "../Card/ArtistCard";
import { DateRange } from "../Misc/DateSelector";

export default function TopArtistShowcase({
    user_handle,
    dateRange,
}: {
    user_handle: string;
    dateRange: DateRange | null;
}) {
    const [topArtists, setTopArtists] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserTopArtists(user_handle,
                {
                    startDate: dateRange?.startDate.toISOString() ?? undefined,
                    endDate: dateRange?.endDate.toISOString() ?? undefined,
                }
            );
            if (response.ok) {
                setTopArtists(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle, dateRange]);

    if (topArtists.length < 3) {
        return <div>Loading top artists...</div>;
    }


    return (
        <div className={"grid gap-5 md:grid-cols-3"}>
            {topArtists.slice(0, 3).map((artist, i) => (
                <ArtistCard key={`top-artist-${i}`} artist={artist} />
            ))}
        </div>
    );
}