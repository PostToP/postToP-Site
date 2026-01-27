import Image from "next/image";

export interface TopArtists {
    artist_id: string
    artist_name: string
    artist_profile_picture_url: string
    listen_count: string
}


export default function ArtistCard({ artist }: { artist: TopArtists }) {
    const ytURL = `https://www.youtube.com/channel/${artist.artist_id}`;
    return (
        <div
            className={
                "w-full content-center overflow-hidden hover:bg-surface-secondary transition-[background-color,translate] duration-160 ease-out hover:translate-y-1"
            }
        >
            <a href={ytURL} target="_blank" rel="noopener noreferrer" className="h-full w-full">
                <div
                    className={"overflow-hidden grid grid-cols-[1fr_3fr_1fr] content-center gap-2"}
                >
                    <div
                        className={"relative aspect-square w-16 m-auto overflow-hidden rounded-full shadow-2xl"}
                    >
                        <Image
                            alt={"thumbnail"}
                            src={artist.artist_profile_picture_url}
                            fill
                            className={"object-cover"}
                            sizes="64px"
                        />
                    </div>
                    <div className={"flex flex-col justify-center break-all"}>
                        <h3
                            className={"line-clamp-1 font-medium"}
                        >
                            {artist.artist_name.replace(" - Topic", "")}
                        </h3>
                    </div>
                    <div className={"text-text-secondary line-clamp-1 content-center"}>{artist.listen_count} scrobbles</div>
                </div>
            </a>
        </div>
    );
}