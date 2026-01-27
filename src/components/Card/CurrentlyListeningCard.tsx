import usePostTopLiveSocket from "@/utils/Backend/PosttopLiveSocket";
import { useEffect, useState } from "react";

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export interface Root {
    userId: number
    video: Video | null
    listeningData: ListeningData | null
}

export interface Video {
    watchID: string
    title: string
    artist: Artist
    duration: number
    coverImage: string
    isMusic: IsMusic
}

export interface Artist {
    name: string
    handle: string
}

export interface IsMusic {
    is_music: boolean
    reviewed: boolean
}

export interface ListeningData {
    currentTime: number
    status: VideoStatus
    updatedAt: string
}

export enum VideoStatus {
    STARTED = 0,
    PLAYING = 1,
    PAUSED = 2,
    ENDED = 3,
}




export default function CurrentlyListeningCard({
    user_handle,
}: {
    user_handle: string
}) {
    const [CurrentlyListeningData, setCurrentlyListeningData] = useState<Root | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const dara = usePostTopLiveSocket(user_handle);

    useEffect(() => {
        dara.connect();
        dara.onVideoUpdate((data: Root) => {
            setCurrentlyListeningData(data);
            setElapsedTime(new Date().getTime() - new Date(data.listeningData!.updatedAt).getTime() > 0 ? Math.floor((new Date().getTime() - new Date(data.listeningData!.updatedAt).getTime()) / 1000) : 0);
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

        if (!CurrentlyListeningData || (CurrentlyListeningData.listeningData.status !== VideoStatus.PLAYING && CurrentlyListeningData.listeningData.status !== VideoStatus.STARTED)) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [CurrentlyListeningData]);
    const ytUrl = CurrentlyListeningData?.video ? `https://www.youtube.com/watch?v=${CurrentlyListeningData.video.watchID}` : '#';

    return (
        <div className="group relative max-w-md mx-auto h-full w-full content-center overflow-hidden rounded-lg border border-gray-800 transition-transform hover:scale-105">
            {CurrentlyListeningData?.video && CurrentlyListeningData?.listeningData ? (
                <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="h-full w-full">
                    {CurrentlyListeningData.video.coverImage && (
                        <img
                            src={CurrentlyListeningData.video.coverImage}
                            alt="Cover"
                            className="-z-10 absolute inset-0 w-full h-full object-cover blur-sm brightness-50 filter transition-all group-hover:blur"
                        />
                    )}
                    <div className="overflow-hidden content-center p-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <h2 className="text-lg font-semibold text-white">Currently Listening</h2>
                        </div>

                        <div className="relative aspect-square w-1/2 m-auto overflow-hidden rounded-lg mb-6">
                            {CurrentlyListeningData.video.coverImage && (
                                <img
                                    src={CurrentlyListeningData.video.coverImage}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute flex h-full w-full items-center justify-center text-6xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 inset-0">
                                ▶
                            </div>
                        </div>

                        <div className="flex flex-col justify-center break-all space-y-1">
                            <h3 className="line-clamp-2 font-medium text-white text-lg">{CurrentlyListeningData.video.title}</h3>
                            <p className="mt-1 line-clamp-1 text-sm text-gray-400">by {CurrentlyListeningData.video.artist.name}</p>
                        </div>

                        <div className="space-y-1 mt-4">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>{formatTime(CurrentlyListeningData.listeningData.currentTime + elapsedTime)}</span>
                                <span>{formatTime(CurrentlyListeningData.video.duration)}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1">
                                <div
                                    className="bg-green-500 h-1 rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(100, ((CurrentlyListeningData.listeningData.currentTime + elapsedTime) / CurrentlyListeningData.video.duration) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </a>
            ) : (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    Currently not listening to anything.
                </div>
            )}
        </div>
    );
}
