// hooks/useRating.ts
import { useState } from "react";

const useRating = (initialRating: number = 0, totalStars: number = 5) => {
    const [rating, setRating] = useState<number>(initialRating);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const handleRating = (rate: number) => setRating(rate);
    const handleHoverRating = (rate: number) => setHoverRating(rate);
    const handleResetHoverRating = () => setHoverRating(0);

    return {
        rating,
        hoverRating,
        setRating: handleRating,
        setHoverRating: handleHoverRating,
        resetHoverRating: handleResetHoverRating,
        totalStars,
    };
};

export default useRating;
