import React from "react";
import ToolTip from "./ToolTip";

const ToolTipIcon = ({ text = "This is a tooltip description." }) => {
    return (
        <div className="relative inline-block">
            {/* Wrapper around just the icon for hover targeting */}
            <div className="group relative inline-block">
                {/* Question Mark Icon */}
                <div className="p-1 rounded-lg">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Circle */}
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        {/* Question mark path */}
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c0-1.105.895-2 2-2s2 .895 2 2c0 .828-.495 1.545-1.2 1.846C13.895 10.37 13 11.253 13 12.5m0 3h.01"
                        />
                    </svg>
                </div>
                
                <ToolTip/>
            </div>
        </div>
    );
};

export default ToolTipIcon;