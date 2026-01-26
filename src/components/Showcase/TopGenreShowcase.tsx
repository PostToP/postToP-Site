import UserBackend from "@/utils/Backend/UserBackend";
import { useEffect, useState } from "react";

export interface TopGenre {
    genre_name: string
    listen_count: string
}

export function generateRandomDarkColor() {
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

function genreToPercentages(data: TopGenre[]) {
    const total = data.reduce((acc, curr) => acc + Number(curr.listen_count), 0);
    return data.map((genre) => {
        return {
            genre: genre.genre_name.replace("https://en.wikipedia.org/wiki/", "").replace(/_/g, " "),
            percentage: Math.round((Number(genre.listen_count) / total) * 100),
        };
    });
}

export default function TopGenreShowcase({
    user_handle
}: {
    user_handle: string;
}) {
    const [topGenres, setTopGenres] = useState<any[]>([]);


    useEffect(() => {
        async function fetchTopGenres() {
            const response = await UserBackend.getUserTopGenres(user_handle);
            if (response.ok) {
                setTopGenres(response.data);
            } else {
                console.error("Failed to fetch top genres:", response.error);
            }
        }

        fetchTopGenres();
    }, [user_handle]);

    const genrePercentages = genreToPercentages(topGenres);
    return (
        <div className={"mt-6 flex w-full rounded-lg"}>
            {genrePercentages.map((genre, i) => (
                <div
                    key={i}
                    className={
                        "group relative cursor-pointer p-2 transition-all hover:z-10 hover:!w-[90%] dark:backdrop-invert"
                    }
                    style={{
                        width: `${genre.percentage}%`,
                        backgroundColor: generateRandomDarkColor(),
                        borderRadius:
                            i == 0
                                ? "0.5rem 0 0 0.5rem"
                                : i == genrePercentages.length - 1
                                    ? "0 0.5rem 0.5rem 0"
                                    : "0",
                        borderRight:
                            i != genrePercentages.length - 1
                                ? "1px solid rgb(var(--secondaryText))"
                                : "none",
                    }}
                >
                    <div
                        className={
                            "absolute bottom-0 left-0 right-0 translate-y-full truncate text-center opacity-30 transition-opacity group-hover:opacity-100"
                        }
                    >
                        {genre.percentage}%
                    </div>
                    <div
                        className={
                            "absolute left-0 right-0 top-0 -translate-y-full truncate text-center opacity-30 transition-opacity group-hover:opacity-100"
                        }
                    >
                        {genre.genre}
                    </div>
                </div>
            ))}
        </div>
    );
}