export interface ListenedMusic {
    video_id: string
    user_id: number
    listened_at: string
    id: string
    yt_id: string
    channel_id: number
    duration: number
    main_category_id: number
    default_language: string
    language: string
    title: string
    description: string
}

export default function ListenedCard({
    item: music,
    className,
}: {
    item: ListenedMusic;
    className?: string;
}) {
    const ytUrl = `https://www.youtube.com/watch?v=${music.yt_id}`;
    return (
        <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 p-4 rounded-lg border border-gray-800 transition-colors hover:bg-gray-800/50 ${className}`}
        >
            <img
                src={`https://img.youtube.com/vi/${music.yt_id}/hqdefault.jpg`}
                alt={music.title}
                className="h-20 w-36 object-cover rounded"
            />
            <h3 className="font-medium text-white line-clamp-2 flex-1">
                {music.title}
            </h3>
            At: {new Date(music.listened_at).toLocaleString()}
        </a>
    );
}
