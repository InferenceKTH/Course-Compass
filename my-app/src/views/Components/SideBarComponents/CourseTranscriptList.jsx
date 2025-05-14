import { useState, useRef, forwardRef } from "react";
import Tooltip from "./ToolTip";

export default function CourseTranscriptList(props) {
    let local = [];
    if (localStorage.getItem("completedCourses"))
        local = JSON.parse(localStorage.getItem("completedCourses"));
    
    const [items, setItems] = useState(local);
    
    // eslint-disable-next-line no-unused-vars
    window.addEventListener("completedCourses changed", event => {
        if (localStorage.getItem("completedCourses"))
            local = JSON.parse(localStorage.getItem("completedCourses"));
        setItems(local);
    });


    function removeItem(index) {
        var newItems = [];
        for (let i = 0; i < items.length; i++) {
            if (i != index)
                newItems.push(items[i]);
        }
        localStorage.setItem("completedCourses", JSON.stringify(newItems));
        window.dispatchEvent(new Event("completedCourses changed"));
        props.reApplyFilter();
    };
    function removeAllItems() {
        let newitems = [];
        localStorage.setItem("completedCourses", JSON.stringify(newitems));
        window.dispatchEvent(new Event("completedCourses changed"));
        props.reApplyFilter();
        if (props.checkboxRef && props.checkboxRef.current) {
            props.checkboxRef.current.click();
        }
    };


    //=====================================
    const tooltipRef = useRef(null);

    const tooltipClasses = [
        "absolute",
        "bg-gray-800",
        "text-white",
        "text-xs",
        "rounded-xl",
        "z-100",
        "px-3",
        "py-2",
        "opacity-0",
        "peer-hover:opacity-100",
        "transition-opacity",
        "duration-200",
        "pointer-events-none",
        "break-words",
        "shadow-lg",
    ].join(" ");

    //=====================================


    return (
        <div className="max-w-80 z-100">
            {items.length > 0 && (
                <div className="flex justify-between">

                    <h3 className="flex-10">Taken courses:</h3>
                    <button
                        onClick={() => removeAllItems()}
                        className="text-red-500 hover:text-red-700 font-bold text-sm hover:bg-red-300 rounded-lg flex-auto h-5"
                    >
                        RemoveAll
                    </button>
                </div>
            )}
            <div className="relative">

                <div
                    className="absolute inset-0 mt-30 pointer-events-none bg-gradient-to-b from-transparent to-[#553d65] z-100"
                ></div>
                <div className="grid grid-cols-3 w-full max-[1200px]:grid-cols-2 max-[700px]:grid-cols-1 gap-1 sm:gap-2 overflow-y-auto overflow-x-hidden max-h-[180px] pb-10" style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f1f1f1",
                }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-[#aba8e0] px-3 py-1 rounded-md shadow-md text-sm min-w-18"
                        >
                            <div className="relative">
                                <span className="flex-auto mr-2 peer">{item?.id}</span>

                                <div className={tooltipClasses}>
                                    {item?.name}
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(index)}
                                className="text-violet-600 hover:text-red-700 font-bold text-sm hover:bg-red-300 rounded-md"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}