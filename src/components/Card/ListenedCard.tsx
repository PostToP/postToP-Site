import {formatTimeAgo} from "@/utils/Date";
import formatNER, {NERResult} from "@/utils/NER";
import YoutubeThumbnail, {ThumbnailQuality} from "../Misc/YoutubeThumbnail";

export interface ListenedMusic {
    yt_id: string;
    listened_at: string;
    video_title: string;
    artist_name: string;
    NER: NERResult | null;
}

export default function ListenedCard({item: music, className}: {item: ListenedMusic; className?: string}) {
    const {title, subtitle} = formatNER(music.NER, music.video_title, music.artist_name);

    const ytUrl = `https://www.youtube.com/watch?v=${music.yt_id}`;
    return (
        <div
            className={`${className} w-full content-center overflow-hidden hover:bg-surface-secondary transition-[background-color,translate] duration-160 ease-out hover:translate-y-1 p-2`}>
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full">
                <div className={"overflow-hidden grid grid-cols-[1fr_3fr_1fr] content-center gap-2"}>
                    <div className={"relative aspect-square w-18 m-auto overflow-hidden rounded-lg shadow-2xl"}>
                        <YoutubeThumbnail yt_id={music.yt_id} quality={ThumbnailQuality.LOW} />
                    </div>
                    <div className={"flex flex-col justify-center break-all"}>
                        <h3 className={"line-clamp-1 font-medium"}>{title}</h3>
                        <p className={"line-clamp-1 text-sm text-text-secondary"}>{subtitle}</p>
                    </div>
                    <div className={"text-text-secondary line-clamp-1 text-sm content-center"}>
                        {formatTimeAgo(new Date(music.listened_at))}
                    </div>
                </div>
            </a>
        </div>
    );
}
