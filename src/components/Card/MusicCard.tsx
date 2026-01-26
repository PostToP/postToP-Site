import Link from "next/dist/client/link"
import YoutubeThumbnail, { ThumbnailQuality } from "../YoutubeThumbnail"

export interface ListenedMusic {
    yt_id: string
    video_title: string
    listen_count: string
    channel: Channel
}

export interface Channel {
    yt_id: string
    name: string
    profile_picture_url: string
}


export default function MusicCard({
    music,
    className,
    small = false,
}: {
    music: ListenedMusic;
    className?: string;
    small?: boolean;
}) {
    const ytUrl = `https://www.youtube.com/watch?v=${music.yt_id}`;
    return (
        <div
            className={`group relative ${className} h-full w-full content-center overflow-hidden rounded-lg border border-gray-800 transition-transform hover:scale-105`}
        >
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full">
                <YoutubeThumbnail
                    yt_id={music.yt_id}
                    className={
                        "-z-10 blur-sm brightness-50 filter transition-all group-hover:blur"
                    }
                    quality={ThumbnailQuality.LOW}
                />
                <div
                    className={`overflow-hidden ${small && "grid grid-cols-[1fr_3fr] gap-3"
                        } content-center p-4`}
                >
                    <div
                        className={`relative aspect-square ${small ? "w-full" : "mb-6 w-1/2"
                            } m-auto overflow-hidden rounded-lg`}
                    >
                        <YoutubeThumbnail yt_id={music.yt_id} quality={small ? ThumbnailQuality.STANDARD : ThumbnailQuality.HIGH} />
                        <div
                            className={
                                "absolute flex h-full w-full items-center justify-center text-6xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            }
                        >
                            ▶
                        </div>
                    </div>
                    <div className={"flex flex-col justify-center break-all"}>
                        <h3
                            className={`line-clamp-2 font-medium text-white ${small ? "text-base" : "text-lg"
                                }`}
                        >
                            {music.video_title}
                        </h3>
                        <p className={"mt-1 line-clamp-1 text-sm text-gray-400"}>
                            by {music.channel.name.replace(" - Topic", "")}
                        </p>
                    </div>
                    <div className={"absolute bottom-1 right-1 text-white"}>x{music.listen_count}</div>
                </div>
            </a>
        </div>
    );
}