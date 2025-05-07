import React from "react";

const ToolTip = ({ text = "This is a tooltip description." }) => {
    return (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap shadow-lg">
            {text}
        </div>
    );
};

export default ToolTip;