import UserBackend from "@/utils/Backend/UserBackend";
import InfiniteList from "./InfiniteList";
import ListenedCard from "../Card/ListenedCard";

export default function ListenHistory({
    userId,
}: {
    userId: string;
}) {

    return (<>
        <h2>History</h2>
        <InfiniteList generator={async (offset) => {
            const response = await UserBackend.getListenHistory(userId, 50, offset);
            if (response.ok) {
                return response.data;
            } else {
                console.error("Failed to fetch listen history:", response.error);
                return [];
            }
        }}
            elementContainer={ListenedCard}
        />
    </>
    );
}