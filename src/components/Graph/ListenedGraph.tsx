import UserBackend from '@/utils/Backend/UserBackend';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
export default function ListenedGraph({
    user_handle
}: {
    user_handle: string;
}) {
    const [data, setData] = useState<any>({});

    useEffect(() => {
        async function fetchTopMusic() {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 10);

            const response = await UserBackend.getUserStats(user_handle, {
                startDate: oneWeekAgo.toISOString(),
                endDate: new Date().toISOString()
            });
            if (response.ok) {
                setData(response.data);
            } else {
                console.error("Failed to fetch top music:", response.error);
            }
        }
        fetchTopMusic();
    }, [user_handle]);


    return (
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
            <CartesianGrid />
            <XAxis dataKey="day" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Area type="natural" dataKey="total_seconds" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
    );
}