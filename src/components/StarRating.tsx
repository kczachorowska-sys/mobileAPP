'use client';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, reviewCount, size = 'md' }: StarRatingProps) {
  const sizeMap = {
    sm: { star: 14, text: 'text-xs', gap: 'gap-0.5' },
    md: { star: 18, text: 'text-sm', gap: 'gap-1' },
    lg: { star: 22, text: 'text-base', gap: 'gap-1' },
  };

  const { star: starSize, text: textSize, gap } = sizeMap[size];

  return (
    <div className={`flex items-center ${gap}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => {
          const fillPercent = Math.min(100, Math.max(0, (rating - i + 1) * 100));
          return (
            <svg
              key={i}
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              className="flex-shrink-0"
            >
              <defs>
                <clipPath id={`star-clip-${i}-${rating}`}>
                  <rect x="0" y="0" width={`${fillPercent}%`} height="100%" />
                </clipPath>
              </defs>
              {/* Empty star background */}
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="none"
                stroke="#D4C5B5"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Filled star */}
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#5D4037"
                clipPath={`url(#star-clip-${i}-${rating})`}
              />
            </svg>
          );
        })}
      </div>
      <span className={`${textSize} font-medium text-charcoal`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={`${textSize} text-warm-brown`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
