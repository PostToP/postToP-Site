import UserBackend from "@/utils/Backend/UserBackend";
import MusicCard from "../Card/MusicCard";
import { useEffect, useState } from "react";

export default function TopMusicShowcase({
    user_handle,
}: {
    user_handle: string;
}) {
    const [topMusic, setTopMusic] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserTopMusic(user_handle);
            if (response.ok) {
                setTopMusic(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle]);

    if (topMusic.length < 4) {
        return <div>Loading top music...</div>;
    }

    return (
        <div
            className={"grid grid-cols-1 gap-5 md:grid-cols-[5fr_4fr] md:grid-rows-3"}
        >
            <MusicCard
                music={topMusic[0]}
                className={"md:row-start-1 md:row-end-4"}
            />
            <MusicCard
                music={topMusic[1]}
                className={"md:row-start-1 md:row-end-2"}
                small={true}
            />
            <MusicCard
                music={topMusic[2]}
                className={"md:row-start-2 md:row-end-3"}
                small={true}
            />
            <MusicCard
                music={topMusic[3]}
                className={"md:row-start-3 md:row-end-4"}
                small={true}
            />
        </div>
    );
}