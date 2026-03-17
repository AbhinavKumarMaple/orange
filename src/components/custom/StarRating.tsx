import { colors } from "@/lib/colors";

/** 12x12 star SVG matching the original site */
function Star() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill={colors.light}>
            <path d="M6 0l1.76 3.57L12 4.14 8.88 7.1l.74 4.32L6 9.27 2.38 11.42l.74-4.32L0 4.14l4.24-.57L6 0z" />
        </svg>
    );
}

export default function StarRating() {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
            ))}
        </div>
    );
}
