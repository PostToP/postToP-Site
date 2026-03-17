import {forwardRef, useState} from "react";
import UserBackend from "@/utils/Backend/UserBackend";
import ListenedCard from "../Card/ListenedCard";
import InfiniteList from "../List/InfiniteList";
import DateSelector, {type DateRange} from "../Misc/DateSelector";
import Modal from "../Misc/Modal";

interface ListenHistoryModalProps {
    userId: string;
}

const ListenHistoryModal = forwardRef<any, ListenHistoryModalProps>(({userId}, ref) => {
    const [dateRange, setDateRange] = useState<DateRange | null>(null);

    return (
        <Modal ref={ref}>
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Listen History</h2>
                <p className="text-sm text-gray-500 mt-1">Browse your complete listening history</p>
            </div>

            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <DateSelector onDateChange={setDateRange} />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <InfiniteList
                    key={dateRange ? `${dateRange.startDate.getTime()}-${dateRange.endDate.getTime()}` : "no-date"}
                    generator={async offset => {
                        const response = await UserBackend.getListenHistory(userId, 50, offset);
                        if (response.ok) {
                            if (dateRange) {
                                return response.data.filter((item: any) => {
                                    const itemDate = new Date(item.created_at);
                                    return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
                                });
                            }
                            return response.data;
                        } else {
                            console.error("Failed to fetch listen history:", response.error);
                            return [];
                        }
                    }}
                    elementContainer={ListenedCard}
                />
            </div>
        </Modal>
    );
});

ListenHistoryModal.displayName = "ListenHistoryModal";

export default ListenHistoryModal;
