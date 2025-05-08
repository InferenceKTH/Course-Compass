import React from 'react';

const StarComponent = ({ index, rating, onRatingChange, onHover, readOnly = false }) => {
    const isInteractive = !readOnly && onRatingChange;
    const fillPercentage = Math.max(0, Math.min(1, rating - index)) * 100;

    return (
        <div
            className={`relative inline-block w-5 h-5 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
            onMouseEnter={() => isInteractive && onHover?.(index + 1)}
            onMouseLeave={() => isInteractive && onHover?.(0)}
        >
            {/* Empty star as background */}
            <i className={`bx bx-star absolute top-0 left-0 text-xl text-violet-500`} />

            {/* Filled portion of the star */}
            <i
                className={`bx bxs-star absolute top-0 left-0 text-xl text-violet-500`}
                style={{
                    width: `${fillPercentage}%`,
                    overflow: 'hidden',
                    display: 'inline-block',
                    whiteSpace: 'nowrap'
                }}
            />

            {/* Click handlers for interactive stars */}
            {isInteractive && (
                <>
                    <button
                        className="absolute top-0 right-1/2 w-1/2 h-full cursor-pointer"
                        onClick={() => onRatingChange(index, true)}
                    />
                    <button
                        className="absolute top-0 left-1/2 w-1/2 h-full cursor-pointer"
                        onClick={() => onRatingChange(index, false)}
                    />
                </>
            )}
        </div>
    );
};

export default StarComponent;
