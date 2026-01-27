
const Data = [
    {
        name: "Last 7 Days",
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    },
    {
        name: "Last Week",
        startDate: (() => {
            const date = new Date();
            const daysSinceMonday = (date.getDay() + 6) % 7;
            date.setDate(date.getDate() - daysSinceMonday - 7);
            date.setHours(0, 0, 0, 0);
            return date;
        })(),
        endDate: (() => {
            const date = new Date();
            const daysSinceMonday = (date.getDay() + 6) % 7;
            date.setDate(date.getDate() - daysSinceMonday - 1);
            date.setHours(23, 59, 59, 999);
            return date;
        })(),
    },
    {
        name: "Last 30 Days",
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
    },
    {
        name: "Last Month",
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
]

export interface DateRange {
    startDate: Date;
    endDate: Date;
}


export default function DateSelector({
    onDateChange,
}: {
    onDateChange?: (dateRange: DateRange) => void;
}
) {
    return (
        <select onChange={(e) => {
            const selected = Data.find(item => item.name === e.target.value);
            if (selected && onDateChange) {
                onDateChange({ startDate: selected.startDate, endDate: selected.endDate });
            }
        }}>
            {Data.map((item) => (
                <option key={item.name} value={item.name}>
                    {item.name}
                </option>
            ))}
        </select>
    );
}