"use client";

import {useContext, useEffect, useRef, useState} from "react";
import Card from "@/components/Card/Card";
import AdminBackend from "@/utils/Backend/AdminBackend";
import { AuthContext } from "@/context/AuthContext";

async function submitReview(watchID: string, genres: string[]) {
    try {
        await AdminBackend.submitGenreReview({watchID, genres});
    } catch (error) {
        console.error("Error submitting review:", error);
    }
}

async function askAiPrediction(watchID: string) {
    return null;
    const URL = "http://localhost:5000/predict";
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                yt_id: watchID,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching AI prediction:", error);
        return null;
    }
}

export default function Page() {
    const allowedGenres = [
        "Pop",
        "Rock",
        "Electronic",
        "Hip Hop",
        "Metal",
        "Folk",
        "Classical",
        "Jazz",
        "R&B",
        "Country",
        "Reggae",
        "Latin",
        "Easy Listening",
        "Blues",
        "New Age",
        "Christian",
        "Traditional Music",
    ];
    const authContext = useContext(AuthContext);
    if (!authContext.loading && (!authContext.user || authContext.user.role !== "Admin")) {
        return null;
    }
    const [res, setRes] = useState({} as any);
    const [left, setLeft] = useState(0);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const resRef = useRef(res);
    useEffect(() => {
        resRef.current = res;
    }, [res]);

    function showNext() {
        AdminBackend.getVideos({
            limit: "1",
            verified: "true",
            sortBy: "random",
            music: "true",
        })
            .then(response => {
                if (response.ok) {
                    setRes(response.data.videos[0]);
                    setLeft(response.data.pagination.totalVideos);
                    setSelectedGenre(null);
                    askAiPrediction(response.data.videos[0].yt_id)
                        .then(aiRes => {
                            console.log("AI prediction:", aiRes);
                            setSelectedGenre(aiRes?.prediction?.predicted_genres?.[0] || null);
                        })
                        .catch(error => {
                            console.error("Error fetching AI prediction:", error);
                        });
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
            if (
                (event.target as HTMLElement).tagName === "INPUT" ||
                (event.target as HTMLElement).tagName === "TEXTAREA"
            ) {
                return;
            }

            if (event.key === "n") {
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

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
                    <h1 className="text-3xl font-semibold">Genre Review</h1>
                    <p className="text-sm text-text-secondary">
                        Space to skip · Enter to add a genre · click submit to lock in
                    </p>
                </div>
                <Card className="max-w-xs">
                    <p className="text-sm text-text-secondary">Items left</p>
                    <p className="text-3xl font-semibold leading-tight">{left}</p>
                    <p className="text-xs text-text-secondary">Pulls only verified music; press space to advance.</p>
                </Card>
            </div>

            {res && Object.keys(res).length === 0 ? (
                <Card className="flex items-center justify-center py-12 text-text-secondary">Loading next video…</Card>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    <Card className="col-span-12 lg:col-span-7 space-y-3">
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={`https://i.ytimg.com/vi/${res.yt_id}/hqdefault.jpg`}
                                alt="Music thumbnail"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                            <span className="rounded-full bg-border/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                                Duration
                            </span>
                            <span className="text-text-primary font-semibold">{secondToTimeString(res.duration)}</span>
                            <span className="rounded-full bg-border/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                                AI guess
                            </span>
                            <span className="font-semibold">
                                {(() => {
                                    if (res.is_music == null)
                                        return <span className="text-text-secondary">Unknown</span>;
                                    if (res.is_music) return <span className="text-green-500">Music</span>;
                                    return <span className="text-red-500">Not music</span>;
                                })()}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Title</p>
                            <h2 className="text-lg font-semibold leading-snug">{res.title}</h2>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-6">{res.description}</p>
                        <button
                            type="button"
                            onClick={showNext}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-text-secondary hover:text-text-primary">
                            Skip (space)
                        </button>
                    </Card>

                    <Card className="col-span-12 lg:col-span-5 space-y-4">
                        <div>
                            <p className="text-sm text-text-secondary">Assign genres</p>
                            <h2 className="text-xl font-semibold">Add tags for this track</h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {selectedGenre ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-3 py-1 text-sm font-medium text-accent-primary">
                                    {selectedGenre}
                                    <button
                                        type="button"
                                        className="text-text-secondary hover:text-text-primary"
                                        onClick={() => setSelectedGenre(null)}>
                                        ×
                                    </button>
                                </span>
                            ) : (
                                <span className="text-sm text-text-secondary">No genre selected.</span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {allowedGenres.map(genre => {
                                const active = selectedGenre === genre;
                                return (
                                    <button
                                        key={genre}
                                        type="button"
                                        onClick={() => setSelectedGenre(active ? null : genre)}
                                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition hover:border-text-secondary hover:text-text-primary ${
                                            active
                                                ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                                                : "border-border text-text-secondary"
                                        }`}>
                                        {genre}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    submitReview(res.yt_id, selectedGenre ? [selectedGenre] : []);
                                    setSelectedGenre(null);
                                    showNext();
                                }}
                                className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110">
                                Submit review
                            </button>
                            <button
                                type="button"
                                onClick={showNext}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-text-secondary hover:text-text-primary">
                                Skip
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}
