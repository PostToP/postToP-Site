"use client";

import { useEffect, useState, useRef } from "react";


async function submitReview(watchID: string, isMusic: boolean) {
    const address = process.env.SERVER || "localhost:8000";
    const url = `http://${address}/review/music`;
    const token = localStorage.getItem("authToken");
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
            watchID: watchID,
            is_music: isMusic,
        }),
    })
    if (!res.ok) {
        console.error("Failed to submit review:", res.statusText);
        return;
    }
}

export default function Page() {
    const [res, setRes] = useState({} as any);
    const resRef = useRef(res);
    useEffect(() => {
        resRef.current = res;
    }, [res]);

    function showNext() {
        const address = process.env.SERVER || "localhost:8000";
        const url = `http://${address}/videos?limit=1&onlyUnreviewed=true&sortBy=random`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setRes(data[0]);
            })
            .catch(error => {
                console.error("Error fetching next item:", error);
            });
    }

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
        submitReview(currentRes.yt_id, isMusic)
            .then(() => showNext())
    }

    return (
        <>
            <h1>Admin/music</h1>
            {res && Object.keys(res).length === 0 ? (
                <div>Loading...</div>
            ) :
                <div>
                    <img src={`https://i.ytimg.com/vi/${res.yt_id}/hqdefault.jpg`} alt="Music Icon" />
                    <h2>{res.title}</h2>
                    <p>{res.description}</p>
                    <button onClick={_ => handleReview(true)}>Music</button>
                    <button onClick={_ => handleReview(false)}>Not Music</button>
                    <button onClick={showNext}>Next</button>
                </div>
            }
        </>
    );
}