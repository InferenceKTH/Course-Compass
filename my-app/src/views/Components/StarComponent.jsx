import React from 'react';

/**
 * Allows to rate things from 0 to 5 stars.
 */
const StarComponent = ({ index, rating, onRatingChange, onHover, readOnly = false }) => {
    const handleLeftClick = () => {
        if (!readOnly) onRatingChange(index, true);
    };

    const handleRightClick = () => {
        if (!readOnly) onRatingChange(index, false);
    };

    const isFullStar = rating >= index + 1;
    const isHalfStar = rating >= index + 0.5 && rating < index + 1;
    const starClass = isFullStar ? "bxs-star" : isHalfStar ? "bxs-star-half" : "bx-star";

    return (
        <div
            className={`relative group leading-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            onMouseEnter={() => !readOnly && onHover && onHover(index + 1)}
            onMouseLeave={() => !readOnly && onHover && onHover(0)}
        >
            <i
                className={`bx ${starClass} text-xl text-violet-500 transition-transform duration-200 ${!readOnly && 'group-hover:scale-110'}`}
            ></i>
            {!readOnly && (
                <>
                    <button
                        className="absolute top-0 right-1/2 w-1/2 h-full cursor-pointer"
                        onClick={handleLeftClick}
                    />
                    <button
                        className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                        onClick={handleRightClick}
                    />
                </>
            )}
        </div>
    );
};

export default StarComponent;
