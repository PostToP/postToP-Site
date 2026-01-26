import { getImageProps } from "next/image";

function getBackgroundImage(srcSet = "") {
    const imageSet = srcSet
        .split(", ")
        .map((str) => {
            const [url, dpi] = str.split(" ");
            return `url("${url}") ${dpi}`;
        })
        .join(", ");
    return `image-set(${imageSet})`;
}

export enum ThumbnailQuality {
    A = "0.jpg",
    B = "1.jpg",
    C = "2.jpg",
    D = "3.jpg",
    STANDARD = "sddefault.jpg",
    LOW = "mqdefault.jpg",
    HIGH = "hqdefault.jpg",
    MAX = "maxresdefault.jpg",
}

function containsBlackBars(quality: ThumbnailQuality) {
    return !(
        quality === ThumbnailQuality.LOW ||
        quality === ThumbnailQuality.MAX
    );
}

export default function YoutubeThumbnail({
    yt_id,
    className,
    quality = ThumbnailQuality.HIGH,
}: {
    yt_id: string;
    className?: string;
    quality?: ThumbnailQuality;
}) {
    const thumbnail_url = `https://i.ytimg.com/vi/${yt_id}/${quality}`;
    const blackBars = containsBlackBars(quality);
    const [width, height] = blackBars ? [480, 360] : [320, 180];
    const {
        props: { srcSet },
    } = getImageProps({ alt: "", width, height, src: thumbnail_url });
    const backgroundImage = getBackgroundImage(srcSet);
    const style = { backgroundImage };
    return (
        <div
            className={`absolute left-0 top-0 size-full overflow-hidden p-4 ${className}`}
        >
            <div
                style={style}
                className={`absolute left-1/2 aspect-video -translate-x-1/2 bg-cover bg-center ${blackBars ? "-top-[18%] h-[135%] w-[185%]" : "top-0 h-full w-[185%]"}`}
            />
        </div>
    );
}