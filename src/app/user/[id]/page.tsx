"use client";
import Card from "@/components/Card/Card";
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
        <main className="grid-rows-[auto_1fr]">
            <DateSelector onDateChange={(dateRange) => {
                setDateRange(dateRange);
            }} />
            <div>User Page for ID: {id}</div>
            <main className="grid grid-cols-12 gap-6">
                < div className="col-span-8 max-h-72" >
                    <CurrentlyListeningCard user_handle={id} />
                </div >
                <div className="col-span-4 row-span-2">
                    <TopMusicShowcase user_handle={id} dateRange={dateRange} />
                </div>
                <div className="col-span-4 row-span-3 gap-6 flex flex-col">
                    <TopArtistShowcase user_handle={id} dateRange={dateRange} />
                    <Card>
                        <h2 className="text-xl font-medium">Top Genres</h2>
                        <div>
                            <TopGenreRadarChart user_handle={id} dateRange={dateRange} />
                        </div>
                    </Card>
                </div>
                <div className="col-span-4">
                    <Card>
                        <h2 className="text-xl font-medium">Listening Activity</h2>
                        <div>
                            <ListenedGraph user_handle={id} dateRange={dateRange} />
                        </div>
                        <span className="text-text-secondary hover:underline">View more ➤</span>
                    </Card>
                </div>
                <div className="col-span-8">
                    <ListenHistory userId={id} />
                </div>
                <div className="col-span-4">
                </div>
            </main >
        </main >
    );
}