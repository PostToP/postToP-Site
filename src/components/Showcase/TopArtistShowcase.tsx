import {useEffect, useRef, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import ArtistCard from "../Card/ArtistCard";
import Card from "../Card/Card";
import type {DateRange} from "../Misc/DateSelector";
import TopArtistModal from "../Modal/TopArtistModal";

export default function TopArtistShowcase({
    user_handle,
    dateRange,
}: {
    user_handle: string;
    dateRange: DateRange | null;
}) {
    const [topArtists, setTopArtists] = useState<any[]>([]);
    const modalRef = useRef<any>(null);

    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserTopArtists(user_handle, {
                startDate: dateRange?.startDate.toISOString() ?? undefined,
                endDate: dateRange?.endDate.toISOString() ?? undefined,
            });
            if (response.ok) {
                setTopArtists(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle, dateRange]);

    return (
        <Card className="relative">
            <h2 className="text-xl font-medium">Top Artists</h2>
            <ul className="flex flex-col gap-2 mt-4 mb-4 divide-y">
                {topArtists.length === 0 && (
                    <p className="text-sm text-text-secondary">No top artists found for the selected date range.</p>
                )}
                {topArtists.slice(0, 5).map((artist, i) => (
                    <ArtistCard key={`top-artist-${i}`} artist={artist} />
                ))}
            </ul>
            <button
                type="button"
                className="text-text-secondary hover:underline cursor-pointer absolute bottom-4 right-4 text-sm"
                onClick={() => modalRef.current.open()}>
                View more ➤
            </button>
            <TopArtistModal ref={modalRef} userId={user_handle} initialDateRange={dateRange} />
        </Card>
    );
}
