"use client";
import ListenHistory from "@/components/List/ListenHistory";
import TopArtistShowcase from "@/components/Showcase/TopArtistShowcase";
import TopGenreShowcase from "@/components/Showcase/TopGenreShowcase";
import TopMusicShowcase from "@/components/Showcase/TopMusicShowcase";
import { useParams } from "next/navigation";

export default function UserPage(
) {
    const params = useParams<{ id: string }>();
    const { id } = params;


    return (
        <main>
            <div>User Page for ID: {id}</div>
            <div className="w-1/2">
                <TopMusicShowcase user_handle={id} />
            </div>
            <div className="w-1/2">
                <TopArtistShowcase user_handle={id} />
            </div>
            <div className="w-1/2">
                <TopGenreShowcase user_handle={id} />
            </div>

            <ListenHistory userId={id} />
        </main>
    );
}