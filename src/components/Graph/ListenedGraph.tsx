import UserBackend from '@/utils/Backend/UserBackend';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { DateRange } from '../Misc/DateSelector';
export default function ListenedGraph({
    user_handle,
    dateRange
}: {
    user_handle: string;
    dateRange: DateRange | null;
}) {
    const [data, setData] = useState<any>({});
    useEffect(() => {
        async function fetchTopMusic() {
            const response = await UserBackend.getUserStats(user_handle, {
                startDate: dateRange?.startDate.toISOString() ?? undefined,
                endDate: dateRange?.endDate.toISOString() ?? undefined,
            });
            if (response.ok) {
                const start = dateRange?.startDate || new Date();
                const end = dateRange?.endDate || new Date();
                const dayInMs = 24 * 60 * 60 * 1000;
                const daysMap: { [key: string]: any } = {};
                for (let d = new Date(start); d <= end; d = new Date(d.getTime() + dayInMs)) {
                    const dayStr = d.toISOString().split('T')[0];
                    daysMap[dayStr] = { day: dayStr, total_seconds: 0 };
                }
                for (const segment of response.data.listen_segments) {
                    const dayStr = new Date(segment.day).toISOString().split('T')[0];
                    daysMap[dayStr] = segment;
                }
                response.data.listen_segments = Object.values(daysMap);
                setData(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle, dateRange]);


    return (
        <>
            <AreaChart
                style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data.listen_segments}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <XAxis
                    dataKey="day"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis width="auto" />
                <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Area type="bump" dataKey="total_seconds" stroke="#82ca9d" fill="#82ca9d" name="Listening Time (seconds)" />
            </AreaChart>
        </>
    );
}