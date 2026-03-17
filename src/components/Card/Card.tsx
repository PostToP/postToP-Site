import {cn} from "clsx-for-tailwind";

export default function Card({children, className}: {children: React.ReactNode; className?: string}) {
    return (
        <div className={cn("bg-surface rounded-xl border border-border p-4 flex-1 min-w-0 min-h-0", className)}>
            {children}
        </div>
    );
}
