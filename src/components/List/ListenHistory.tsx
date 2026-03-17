import {useEffect, useRef, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import Card from "../Card/Card";
import ListenedCard from "../Card/ListenedCard";
import ListenHistoryModal from "../Modal/ListenHistoryModal";

export default function ListenHistory({userId}: {userId: string}) {
    const [musicList, setMusicList] = useState<any[]>([]);
    const modalRef = useRef<any>(null);

    useEffect(() => {
        async function fetchListenHistory() {
            const response = await UserBackend.getListenHistory(userId, 5, 0);
            if (response.ok) {
                setMusicList(response.data);
            } else {
                console.error("Failed to fetch listen history:", response.error);
            }
        }
        fetchListenHistory();
    }, [userId]);

    return (
        <Card>
            <h2 className="text-xl font-medium">Recent Tracks</h2>
            <ul className="flex flex-col gap-2 mt-4 mb-4  divide-y">
                {musicList.map((music, index) => (
                    <ListenedCard key={`listened-music-${index}`} item={music} />
                ))}
            </ul>
            <button
                type="button"
                className="text-text-secondary hover:underline cursor-pointer"
                onClick={() => modalRef.current.open()}>
                View more ➤
            </button>
            <ListenHistoryModal ref={modalRef} userId={userId} />

            {/* <InfiniteList generator={async (offset) => {
            const response = await UserBackend.getListenHistory(userId, 50, offset);
            if (response.ok) {
                return response.data;
            } else {
                console.error("Failed to fetch listen history:", response.error);
                return [];
            }
        }}
            elementContainer={ListenedCard}
        /> */}
        </Card>
    );
}
