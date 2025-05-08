import React from 'react';
import RatingComponent from "./RatingComponent.jsx";

function RatingDisplay({ rating }) {
  const score = parseFloat(rating || 0).toFixed(1);

  return (
    <div className="flex items-center gap-2 text-sm">
      <RatingComponent value={parseFloat(score)} readOnly />
      <span className="text-gray-700">({score} / 5)</span>
    </div>
  );
}

export default RatingDisplay;
