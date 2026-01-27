import UserBackend from "@/utils/Backend/UserBackend";
import { useEffect, useState } from "react";
import ArtistCard from "../Card/ArtistCard";
import Card from "../Card/Card";
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
        <Card>
            <h2 className="text-xl font-medium">Top Artists</h2>
            <ul className="flex flex-col gap-2 mt-4 mb-4 divide-y">
                {topArtists.slice(0, 5).map((artist, i) => (
                    <ArtistCard key={`top-artist-${i}`} artist={artist} />
                ))}
            </ul>
            <span className="text-text-secondary hover:underline">View more ➤</span>
        </Card>
    );
}