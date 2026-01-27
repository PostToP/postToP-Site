"use client";
import CurrentlyListeningCard from "@/components/Card/CurrentlyListeningCard";
import ListenedGraph from "@/components/Graph/ListenedGraph";
import TopGenreRadarChart from "@/components/Graph/TopGenreRadarChart";
import ListenHistory from "@/components/List/ListenHistory";
import DateSelector, { DateRange } from "@/components/Misc/DateSelector";
import TopArtistShowcase from "@/components/Showcase/TopArtistShowcase";
import TopMusicShowcase from "@/components/Showcase/TopMusicShowcase";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UserPage(
) {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    return (
        <main>
            <CurrentlyListeningCard user_handle={id} />
            <DateSelector onDateChange={(dateRange) => {
                setDateRange(dateRange);
            }} />
            <div>User Page for ID: {id}</div>
            <div className="w-1/2">
                <TopMusicShowcase user_handle={id} dateRange={dateRange} />
            </div>
            <div className="w-1/2">
                <TopArtistShowcase user_handle={id} dateRange={dateRange} />
            </div>
            <div className="w-1/2">
                <TopGenreRadarChart user_handle={id} dateRange={dateRange} />
            </div>
            <ListenedGraph user_handle={id} dateRange={dateRange} />
            <ListenHistory userId={id} />
        </main>
    );
}