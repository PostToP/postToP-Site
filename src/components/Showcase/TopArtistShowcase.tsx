import UserBackend from "@/utils/Backend/UserBackend";
import ArtistCard from "../Card/ArtistCard";
import { useEffect, useState } from "react";

export default function TopArtistShowcase({
    user_handle,
}: {
    user_handle: string;
}) {
    const [topArtists, setTopArtists] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserTopArtists(user_handle);
            if (response.ok) {
                setTopArtists(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle]);

    if (topArtists.length < 3) {
        return <div>Loading top artists...</div>;
    }


    return (
        <div className={"grid gap-5 md:grid-cols-3"}>
            {topArtists.slice(0, 3).map((artist, i) => (
                <ArtistCard key={i} artist={artist} />
            ))}
        </div>
    );
}