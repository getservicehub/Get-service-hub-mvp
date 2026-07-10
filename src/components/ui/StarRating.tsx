type Props = {
  rating: number;
  size?: string;
};

export default function StarRating({ rating, size = "text-sm" }: Props) {
  return (
    <div className={`flex gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fillPercent = Math.max(0, Math.min(100, (rating - (i - 1)) * 100));
        return (
          <span key={i} className="relative inline-block leading-none">
            <span className="text-white/15">★</span>
            <span
              className="absolute top-0 left-0 text-amber-400 overflow-hidden whitespace-nowrap"
              style={{ width: `${fillPercent}%` }}
            >
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
}
