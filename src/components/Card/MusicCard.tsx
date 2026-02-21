import formatNER, { NERResult } from "@/utils/NER"
import YoutubeThumbnail, { ThumbnailQuality } from "../Misc/YoutubeThumbnail"

export interface ListenedMusic {
    yt_id: string
    video_title: string
    listen_count: string
    channel: Channel
    NER: NERResult | null
}

export interface Channel {
    yt_id: string
    name: string
    profile_picture_url: string
}


export default function MusicCard({
    music,
    className,
}: {
    music: ListenedMusic;
    className?: string;
}) {
    const { title, subtitle } = formatNER(music.NER, music.video_title, music.channel.name);


    const ytUrl = `https://www.youtube.com/watch?v=${music.yt_id}`;
    return (
        <div
            className={`${className} w-full content-center overflow-hidden hover:bg-surface-secondary transition-[background-color,translate] duration-160 ease-out hover:translate-y-1 p-2`}
        >
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full">
                <div
                    className={"overflow-hidden grid grid-cols-[1fr_3fr_1fr] content-center gap-2"}
                >
                    <div
                        className={"relative aspect-square w-16 m-auto overflow-hidden rounded-lg shadow-2xl"}
                    >
                        <YoutubeThumbnail yt_id={music.yt_id} quality={ThumbnailQuality.STANDARD} />
                    </div>
                    <div className={"flex flex-col justify-center break-all"}>
                        <h3
                            className={"line-clamp-1 font-medium"}
                        >
                            {title}
                        </h3>
                        <p className={"line-clamp-1 text-sm text-text-secondary"}>
                            {subtitle}
                        </p>
                    </div>
                    <div className={"text-text-secondary line-clamp-1 content-center"}>{music.listen_count} scrobbles</div>
                </div>
            </a>
        </div>
    );
}