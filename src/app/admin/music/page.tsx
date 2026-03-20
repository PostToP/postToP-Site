"use client";

import {useContext, useEffect, useRef, useState} from "react";
import Card from "@/components/Card/Card";
import AdminBackend from "@/utils/Backend/AdminBackend";
import { AuthContext } from "@/context/AuthContext";

async function submitReview(watchID: string, isMusic: boolean) {
    try {
        await AdminBackend.submitMusicReview({watchID, is_music: isMusic});
    } catch (error) {
        console.error("Error submitting review:", error);
    }
}

export default function Page() {
    const authContext = useContext(AuthContext);
    if (!authContext.loading && (!authContext.user || authContext.user.role !== "Admin")) {
        return null;
    }
    const [res, setRes] = useState({} as any);
    const [left, setLeft] = useState(0);
    const resRef = useRef(res);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [playerHidden, setPlayerHidden] = useState(true);
    useEffect(() => {
        resRef.current = res;
    }, [res]);

    

    function showNext() {
        setPlayerHidden(true);
        AdminBackend.getVideos({
            limit: "1",
            verified: "false",
            sortBy: "random",
        })
            .then(response => {
                if (response.ok) {
                    setRes(response.data.videos[0]);
                    setLeft(response.data.pagination.totalVideos);
                } else {
                    console.error("Error fetching next item:", response.error);
                }
            })
            .catch(error => {
                console.error("Error fetching next item:", error);
            });
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        showNext();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                handleReview(true);
            } else if (event.key === "ArrowRight") {
                handleReview(false);
            } else if (event.key === " ") {
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function handleReview(isMusic: boolean) {
        const currentRes = resRef.current;
        submitReview(currentRes.yt_id, isMusic).then(() => showNext());
    }

    function secondToTimeString(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    return (
        <main className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">Admin</p>
                    <h1 className="text-3xl font-semibold">Music Review</h1>
                    <p className="text-sm text-text-secondary">← music · → not music · space to skip</p>
                </div>
                <Card className="max-w-xs">
                    <p className="text-sm text-text-secondary">Items left</p>
                    <p className="text-3xl font-semibold leading-tight">{left}</p>
                    <p className="text-xs text-text-secondary">Keep the queue moving with the shortcuts above.</p>
                </Card>
            </div>

            {res && Object.keys(res).length === 0 ? (
                <Card className="flex items-center justify-center py-12 text-text-secondary">Loading next video…</Card>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    <Card className="col-span-12 lg:col-span-8">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface">
                            <img
                                src={`https://i.ytimg.com/vi/${res.yt_id}/hqdefault.jpg`}
                                alt="Music thumbnail"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <iframe
                                onLoad={() => {
                                    setPlayerHidden(false);
                                }}
                                ref={iframeRef}
                                className={`absolute inset-0 h-full w-full ${playerHidden ? "hidden" : ""}`}
                                src={`https://www.youtube.com/embed/${res.yt_id}`}
                                title="Youtube Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                        <p className="mt-3 text-sm text-text-secondary">
                            If the player is blocked, open in a new tab:{" "}
                            <a
                                className="text-accent-primary underline"
                                href={`https://www.youtube.com/watch?v=${res.yt_id}`}
                                target="_blank"
                                rel="noreferrer">
                                YouTube link
                            </a>
                        </p>
                    </Card>

                    <Card className="col-span-12 lg:col-span-4 space-y-3">
                        <div className="space-y-1">
                            <p className="text-sm text-text-secondary">Duration</p>
                            <p className="text-lg font-semibold">{secondToTimeString(res.duration)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-text-secondary">Title</p>
                            <p className="font-medium leading-snug">{res.title}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-text-secondary">According to AI</p>
                            <p className="font-semibold">
                                {(() => {
                                    if (res.is_music == null)
                                        return <span className="text-text-secondary">Unknown</span>;
                                    if (res.is_music) return <span className="text-green-500">Yes</span>;
                                    return <span className="text-red-500">No</span>;
                                })()}
                            </p>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-6">{res.description}</p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                type="button"
                                onClick={_ => handleReview(true)}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
                                Music (←)
                            </button>
                            <button
                                type="button"
                                onClick={_ => handleReview(false)}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700">
                                Not Music (→)
                            </button>
                            <button
                                type="button"
                                onClick={showNext}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-text-secondary hover:text-text-primary">
                                Skip (space)
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}
