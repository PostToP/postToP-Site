import {useEffect, useState} from "react";
import usePostTopLiveSocket from "@/utils/Backend/PosttopLiveSocket";
import formatNER, {NERResult} from "@/utils/NER";
import YoutubeThumbnail, {ThumbnailQuality} from "../Misc/YoutubeThumbnail";
import Card from "./Card";

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export interface Root {
    userId: number;
    video: Video | null;
    listeningData: ListeningData | null;
}

export interface Video {
    watchID: string;
    title: string;
    artist: Artist;
    duration: number;
    coverImage: string;
    isMusic: IsMusic;
    NER: NERResult | null;
}

export interface Artist {
    name: string;
    handle: string;
}

export interface IsMusic {
    is_music: boolean;
    reviewed: boolean;
}

export interface ListeningData {
    currentTime: number;
    status: VideoStatus;
    updatedAt: string;
}

export enum VideoStatus {
    STARTED = 0,
    PLAYING = 1,
    PAUSED = 2,
    ENDED = 3,
}

export default function CurrentlyListeningCard({user_handle}: {user_handle: string}) {
    const [CurrentlyListeningData, setCurrentlyListeningData] = useState<Root | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const dara = usePostTopLiveSocket(user_handle);

    useEffect(() => {
        dara.connect();
        dara.onVideoUpdate((data: Root) => {
            setCurrentlyListeningData(data);
            if (data.listeningData === null) {
                setElapsedTime(0);
                return;
            } else
                setElapsedTime(
                    new Date().getTime() - new Date(data.listeningData!.updatedAt).getTime() > 0
                        ? Math.floor((new Date().getTime() - new Date(data.listeningData!.updatedAt).getTime()) / 1000)
                        : 0,
                );
        });
        return () => {
            dara.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!CurrentlyListeningData) {
            return;
        }

        if (CurrentlyListeningData.listeningData === null) {
            return;
        }

        if (
            !CurrentlyListeningData ||
            (CurrentlyListeningData.listeningData.status !== VideoStatus.PLAYING &&
                CurrentlyListeningData.listeningData.status !== VideoStatus.STARTED)
        ) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [CurrentlyListeningData]);
    const ytUrl = CurrentlyListeningData?.video
        ? `https://www.youtube.com/watch?v=${CurrentlyListeningData.video.watchID}`
        : "#";

    let {title, subtitle} = formatNER(
        CurrentlyListeningData?.video?.NER || null,
        CurrentlyListeningData?.video?.title || "Unknown Title",
        CurrentlyListeningData?.video?.artist.name || "Unknown Artist",
    );

    return (
        <Card>
            {CurrentlyListeningData?.video && CurrentlyListeningData?.listeningData ? (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_5fr] gap-3 md:gap-4 size-full">
                    <div className="flex justify-center md:block">
                        <div className="aspect-square w-48 md:w-64 overflow-hidden rounded-lg">
                            {CurrentlyListeningData.video.coverImage && (
                                <div
                                    className={
                                        "relative aspect-square w-full m-auto overflow-hidden rounded-lg shadow-2xl"
                                    }>
                                    <YoutubeThumbnail
                                        yt_id={CurrentlyListeningData.video.watchID}
                                        quality={ThumbnailQuality.STANDARD}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 md:space-y-1 h-full justify-between">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs md:text-sm text-text-secondary">Currently Playing</h3>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                CurrentlyListeningData.listeningData.status === VideoStatus.PLAYING || 
                                CurrentlyListeningData.listeningData.status === VideoStatus.STARTED
                                    ? 'bg-accent-primary/20 text-accent-primary'
                                    : 'bg-disabled text-text-secondary'
                            }`}>
                                <span>{CurrentlyListeningData.listeningData.status === VideoStatus.PAUSED ? '⏸' : '▶'}</span>
                                <span>{CurrentlyListeningData.listeningData.status === VideoStatus.PAUSED ? 'Paused' : 'Playing'}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="line-clamp-2 md:line-clamp-1 font-medium text-base md:text-lg">{title}</h3>
                            <p className="line-clamp-2 md:line-clamp-1 text-xs md:text-sm text-text-secondary">{subtitle}</p>
                        </div>
                        <div className="space-y-2 md:space-y-1 mt-2 md:mt-4">
                            <div className="w-full bg-disabled rounded-full h-2 md:h-1">
                                <div
                                    className={`h-2 md:h-1 rounded-full transition-all duration-1000 ease-linear relative ${
                                        CurrentlyListeningData.listeningData.status === VideoStatus.PAUSED
                                            ? 'bg-text-secondary/50'
                                            : 'bg-accent-primary'
                                    }`}
                                    style={{
                                        width: `${Math.min(100, ((CurrentlyListeningData.listeningData.currentTime + elapsedTime) / CurrentlyListeningData.video.duration) * 100)}%`,
                                    }}>
                                    <div className={`size-3 md:size-4 absolute -right-1.5 md:-right-2 rounded-full -translate-1/2 top-1/2 ${
                                        CurrentlyListeningData.listeningData.status === VideoStatus.PAUSED
                                            ? 'bg-text-secondary'
                                            : 'bg-accent-primary'
                                    }`} />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-text-secondary">
                                <span>
                                    {formatTime(CurrentlyListeningData.listeningData.currentTime + elapsedTime)}
                                </span>
                                <span>{formatTime(CurrentlyListeningData.video.duration)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center py-8 md:py-12 text-text-secondary text-sm md:text-base">
                    Currently not listening to anything.
                </div>
            )}
        </Card>
    );
}
