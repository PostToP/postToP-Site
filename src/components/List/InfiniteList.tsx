import {ComponentType, useEffect, useRef, useState} from "react";

export default function InfiniteList({
    generator,
    elementContainer: ElementContainer,
    scrollableParent,
}: {
    generator: (offset: number) => Promise<any[]>;
    elementContainer: ComponentType<any>;
    scrollableParent?: HTMLElement | null;
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);
    const hasMore = useRef(true);

    async function loadMore() {
        if (loading) return;
        if (!hasMore.current) return;
        setLoading(true);
        const newItems = await generator(items.length);
        if (newItems.length === 0) {
            hasMore.current = false;
        }
        setItems(prevItems => [...prevItems, ...newItems]);
        setLoading(false);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                root: scrollableParent || null,
            },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [items.length, loading, scrollableParent]);

    return (
        <pre>
            <ul className="divide-y">
                {items.map((item, index) => (
                    <ElementContainer key={`item-${index}`} item={item} />
                ))}
            </ul>
            {loading && <div>Loading...</div>}
            <div ref={observerTarget} style={{height: "1px"}} />
        </pre>
    );
}
