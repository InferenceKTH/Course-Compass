import React, { useRef } from "react";

const Tooltip = ({
  text = "This is a tooltip that flips sides if it's too close to the right edge of the screen.",
  position = "right",
  hiddenIcon = false,
}) => {
  const tooltipRef = useRef(null);

  const tooltipClasses = [
    "absolute",
    "top-1/2",
    "-translate-y-1/7", // fixed typo from "-translate-y-1/7"
    "bg-gray-800",
    "text-white",
    "text-xs",
    "rounded-xl",
    "px-3",
    "py-2",
    "opacity-0",
    "peer-hover:opacity-100",
    "transition-opacity",
    "duration-200",
    "z-50",
    "pointer-events-none",
    "break-words",
    "shadow-lg",
    "w-[250px]",
    position === "left" ? "right-full mr-2" : "left-full ml-2",
  ].join(" ");

  return (
      <div className="relative inline-block">
          <div className="peer">
              
      {!hiddenIcon && (
          <svg
          className="w-5 h-5 text-gray-600 "
          fill="white"
          stroke="gray"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          >
          <circle cx="13" cy="11" r="10" stroke="white" strokeWidth="2.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M12 8c0-1.105.895-2 2-2s2 .895 2 2c0 .828-.495 1.545-1.2 1.846C13.895 10.37 13 11.253 13 12.5m0 3h.01"
            />
        </svg>
      )}

      </div>
      <div ref={tooltipRef} className={tooltipClasses}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
