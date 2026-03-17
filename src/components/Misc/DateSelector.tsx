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
    {
        name: "This Year",
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date(),
    },
    {
        name: "Last Year",
        startDate: new Date(new Date().getFullYear() - 1, 0, 1),
        endDate: new Date(new Date().getFullYear() - 1, 11, 31, 23, 59, 59, 999),
    },
];

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export default function DateSelector({onDateChange}: {onDateChange?: (dateRange: DateRange) => void}) {
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-text-secondary mr-3">Time Period:</label>
            <select
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={e => {
                    const selected = Data.find(item => item.name === e.target.value);
                    if (selected && onDateChange) {
                        onDateChange({startDate: selected.startDate, endDate: selected.endDate});
                    }
                }}>
                {Data.map(item => (
                    <option key={item.name} value={item.name}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
