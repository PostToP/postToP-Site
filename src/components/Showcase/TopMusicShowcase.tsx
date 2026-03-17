import {useEffect, useRef, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import Card from "../Card/Card";
import MusicCard from "../Card/MusicCard";
import type {DateRange} from "../Misc/DateSelector";
import TopMusicModal from "../Modal/TopMusicModal";

export default function TopMusicShowcase({user_handle, dateRange}: {user_handle: string; dateRange: DateRange | null}) {
    const [topMusic, setTopMusic] = useState<any[]>([]);
    const modalRef = useRef<any>(null);

    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserTopMusic(user_handle, {
                startDate: dateRange?.startDate.toISOString() ?? undefined,
                endDate: dateRange?.endDate.toISOString() ?? undefined,
            });
            if (response.ok) {
                setTopMusic(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle, dateRange]);

    if (topMusic.length < 4) {
        return <div>Loading top music...</div>;
    }

    return (
        <Card>
            <h2 className="text-xl font-medium">Top Tracks</h2>
            <ul className="flex flex-col gap-2 mt-4 mb-4  divide-y">
                {topMusic.slice(0, 6).map((music, index) => (
                    <MusicCard key={`top-music-${index}`} music={music} />
                ))}
            </ul>
            {/* <span className="text-text-secondary hover:underline">View more ➤</span> */}
            <button
                type="button"
                className="text-text-secondary hover:underline cursor-pointer"
                onClick={() => modalRef.current.open()}>
                View more ➤
            </button>
            <TopMusicModal ref={modalRef} userId={user_handle} initialDateRange={dateRange} />
        </Card>
    );
}
