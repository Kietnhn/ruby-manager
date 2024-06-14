// components/StarRating.tsx
import { StarIcon } from "@heroicons/react/20/solid";
import { cn } from "@nextui-org/react";
import React, { useId } from "react";

interface StarRatingProps {
    rating: number;
    hoverRating: number;
    setRating: (rating: number) => void;
    setHoverRating: (rating: number) => void;
    resetHoverRating: () => void;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    hoverRating,
    setRating,
    setHoverRating,
    resetHoverRating,
    className,
}) => {
    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <StarIcon
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={resetHoverRating}
                        className={cn(
                            "h-10 w-10 cursor-pointer transition-colors duration-100",
                            starValue <= (hoverRating || rating)
                                ? "text-black dark:text-white"
                                : "text-content4",
                            className
                        )}
                    />
                );
            })}
        </div>
    );
};

export const StarRatingReadyOnly: React.FC<
    Pick<StarRatingProps, "rating" | "className">
> = ({ rating, className }) => {
    const maxRating = 5; // Maximum rating value
    const filledStars = Math.floor(rating); // Number of full stars
    const remainder = rating - filledStars; // Remainder for partially filled star
    const partiallyFilledStar = remainder > 0; // Check if there's a partially filled star

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
        stars.push(<Star percentage={100} key={`Filled star ${i}`} />);
    }
    if (partiallyFilledStar) {
        const percentage = remainder * 100;

        stars.push(
            <Star percentage={percentage} key={"partiallyFilledStar"} />
        );
    }
    // Fill remaining stars with empty stars
    for (
        let i = filledStars + (partiallyFilledStar ? 1 : 0);
        i < maxRating;
        i++
    ) {
        stars.push(<Star percentage={0} key={`Empty star ${i}`} />);
    }

    return <div className="flex space-x-1">{stars}</div>;
};
export default StarRating;

interface StarProps {
    percentage: number;
}

export const Star: React.FC<StarProps> = ({ percentage }) => {
    const tmpId = useId();
    return (
        <div className="relative inline-block w-4 h-4">
            <svg viewBox="0 0 24 24" className="w-full h-full">
                <defs>
                    <clipPath id={tmpId}>
                        <rect
                            x="0"
                            y="0"
                            width={`${percentage}%`}
                            height="100%"
                        />
                    </clipPath>
                </defs>
                <path
                    className="text-content4"
                    fill="currentColor"
                    d="M12 .587l3.668 7.571L24 9.753l-6 5.847 1.416 8.257L12 18.897l-7.416 4.96L6 15.6l-6-5.847 8.332-1.595L12 .587z"
                />
                <path
                    className="text-black dark:text-white"
                    fill="currentColor"
                    clipPath={`url(#${tmpId})`}
                    d="M12 .587l3.668 7.571L24 9.753l-6 5.847 1.416 8.257L12 18.897l-7.416 4.96L6 15.6l-6-5.847 8.332-1.595L12 .587z"
                />
            </svg>
        </div>
    );
};
