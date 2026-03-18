import {forwardRef, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import ArtistCard from "../Card/ArtistCard";
import InfiniteList from "../List/InfiniteList";
import DateSelector, {type DateRange} from "../Misc/DateSelector";
import Modal from "../Misc/Modal";

interface TopArtistModalProps {
    userId: string;
    initialDateRange?: DateRange | null;
}

function convertToTopArtistItem({item}: {item: any}) {
    return <ArtistCard artist={item} />;
}

const TopArtistModal = forwardRef<any, TopArtistModalProps>(({userId, initialDateRange}, ref) => {
    const [dateRange, setDateRange] = useState<DateRange | null>(initialDateRange || null);

    return (
        <Modal ref={ref}>
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold">Top Artists</h2>
                <p className="text-sm text-gray-500 mt-1">Discover your most listened artists</p>
            </div>

            <div className="p-6 border-b border-gray-200 bg-surface-secondary">
                <DateSelector onDateChange={setDateRange} />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <InfiniteList
                    key={dateRange ? `${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}` : "no-date"}
                    generator={async offset => {
                        const response = await UserBackend.getUserTopArtists(userId, {
                            startDate: dateRange?.startDate.toISOString() ?? undefined,
                            endDate: dateRange?.endDate.toISOString() ?? undefined,
                            limit: 50,
                            offset,
                        });
                        if (response.ok) {
                            return response.data;
                        } else {
                            console.error("Failed to fetch top artists:", response.error);
                            return [];
                        }
                    }}
                    elementContainer={convertToTopArtistItem}
                />
            </div>
        </Modal>
    );
});

TopArtistModal.displayName = "TopArtistModal";

export default TopArtistModal;
