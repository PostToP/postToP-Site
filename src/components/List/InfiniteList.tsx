import { ComponentType, useEffect, useRef, useState } from "react";

export default function InfiniteList({
    generator,
    elementContainer: ElementContainer
}: {
    generator: (offset: number) => Promise<any[]>;
    elementContainer: ComponentType<any>;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    async function loadMore() {
        if (loading) return;
        setLoading(true);
        const newItems = await generator(items.length);
        setItems((prevItems) => [...prevItems, ...newItems]);
        setLoading(false);
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [items.length, loading]);

    return (
        <pre>
            <ul>
                {items.map((item, index) => (
                    <ElementContainer key={`item-${index}`} item={item} />
                ))}
            </ul>
            {loading && <div>Loading...</div>}
            <div ref={observerTarget} style={{ height: '1px' }} />
        </pre>
    );
}