import React from 'react';
import StarComponent from "./StarComponent.jsx";
/**
 * Component that handles reviews in the form of stars. StarComponent is used for the actual stars.
 */
const RatingComponent = ({ value = 0, onChange, readOnly = false, className = "" }) => {
    const handleRating = (starIndex, isLeftHalf) => {
        if (readOnly) return;
        const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
        onChange(newRating);
    };

    return (
        <div className={`font-kanit flex justify-center items-center bg-transparent ${className}`}>
            {/* <div className="flex gap-1 sm:gap-2"> */}
            <div className="flex gap-[1px] text-xs leading-none">


                {Array.from({ length: 5 }, (_, index) => (
                    <StarComponent
                        key={index}
                        index={index}
                        rating={value}
                        onRatingChange={handleRating}
                        readOnly={readOnly}
                    />
                ))}
            </div>
        </div>
    );
};

export default RatingComponent;
