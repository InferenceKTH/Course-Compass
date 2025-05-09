import React, { useState } from 'react';

function ImageFlipper() {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="fixed left-12 top-24 z-40">
            <div
                className={`flipper-container w-64 h-96 cursor-pointer perspective-1000`}
                onClick={handleFlip}
            >
                <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                    }`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden">
                        <img
                            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/black-maximalist-casino-night-party-flyer-a5-design-template-cc6276c98bca40a1c9da5a4a3ba77075_screen.jpg?ts=1728104810"
                            alt="Casino Night Front"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180">
                        <img
                            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/casino-game-pinterest-graphic-design-template-5a276f8e87751ccaa70630323918d53f_screen.jpg?ts=1724443212"
                            alt="Casino Night Back"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageFlipper;