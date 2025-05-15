import React from "react";
import RatingComponent from "./RatingComponent";

/**
 * A small read-only star rating display for course listings.
 */
const RatingDisplay = ({ value = 0 }) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      <RatingComponent value={value} readOnly className="scale-90" />
      <span className="text-gray-600 text-sm">{value.toFixed(1)} / 5</span>
    </div>
  );
};

export default RatingDisplay;
