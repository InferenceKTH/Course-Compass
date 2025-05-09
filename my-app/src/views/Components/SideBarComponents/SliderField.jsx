import React, { useState, useRef, useEffect } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function UploadField(props) {
    let paramFieldType = "slider";

    const values = [
        1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
        6, 7, 7.5, 8, 8.5, 9, 10, 11, 12, 13.5,
        14, 15, 20, 22.5, 30, 45
    ];

    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(values.length - 1);
    const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
    const sliderRef = useRef(null);
    const checkboxRef = useRef(null);

    useEffect(() => {
        for (let i = 0; i < values.length; i++) {
            if (values[i] === props.initialValues[0]) {
                setMinIndex(i);
            }
            if (values[i] === props.initialValues[1]) {
                setMaxIndex(i);
            }
        }
    }, []); // Empty dependency array ensures this runs only once

    const handleDrag = (e, thumbType) => {
        const slider = sliderRef.current;
        if (!slider) return;

        const rect = slider.getBoundingClientRect();
        const clientX = e.type.includes("touch")
            ? e.touches[0].clientX
            : e.clientX;

        const percent = Math.min(
            1,
            Math.max(0, (clientX - rect.left) / rect.width)
        );

        const index = Math.round(percent * (values.length - 1));

        if (thumbType === "min") {
            setMinIndex(Math.min(index, maxIndex - 1));
        } else {
            setMaxIndex(Math.max(index, minIndex + 1));
        }
    };

    return (
        <div className="m-2">
            <div className="mb-2 text-white flex items-center justify-between">
                <div className="flex-none items-center">
                    <h3>{String(props.filterName).charAt(0).toUpperCase() + String(props.filterName).slice(1)}</h3>
                </div>
                <div className="flex-auto pl-3 pt-2">
                    <Tooltip
                        text={props.description}
                        position={"right"}
                    />
                </div>
                <FilterEnableCheckbox
                    ref={checkboxRef}
                    initialValue={filterEnabled}
                    onToggle={() => { setFilterEnabled(!filterEnabled); props.HandleFilterEnable([props.filterName, !filterEnabled]); }}
                />
            </div>

            <div className={`${filterEnabled ? "opacity-100" : "opacity-50"}`} onClick={() => {
                    if (!filterEnabled && checkboxRef.current) {
                        checkboxRef.current.click();
                    }
                 }}>
                <div className="bg-[#aba8e0] text-white p-4 rounded-lg shadow-lg border border-gray-300">
                    <div className="mb-2 text-sm font-bold">
                        Credits: {values[minIndex]} – {values[maxIndex]}
                    </div>

                    {/* SLIDER */}
                    <div
                        ref={sliderRef}
                        className="relative h-3 bg-gray-300 rounded-full cursor-pointer"
                        onMouseDown={(e) => handleDrag(e, "bar")}
                        onTouchStart={(e) => handleDrag(e, "bar")}
                    >
                        {/* Selected range bar */}
                        <div
                            className="absolute h-full bg-violet-500 rounded-full"
                            style={{
                                left: `${(minIndex / (values.length - 1)) * 100}%`,
                                width: `${((maxIndex - minIndex) / (values.length - 1)) * 100}%`
                            }}
                        />

                        {/* Min thumb */}
                        <div
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const move = (ev) => handleDrag(ev, "min");
                                const up = () => {
                                    window.removeEventListener("mousemove", move);
                                    window.removeEventListener("mouseup", up);
                                };
                                window.addEventListener("mousemove", move);
                                window.addEventListener("mouseup", up);
                            }}
                            onTouchStart={(e) => {
                                const move = (ev) => handleDrag(ev, "min");
                                const end = () => {
                                    window.removeEventListener("touchmove", move);
                                    window.removeEventListener("touchend", end);
                                };
                                window.addEventListener("touchmove", move);
                                window.addEventListener("touchend", end);
                            }}
                            onMouseUp={() => props.HandleFilterChange([paramFieldType, props.filterName, [values[minIndex], values[maxIndex]]])}
                            className="absolute top-1/2 -translate-y-1/2 bg-violet-600 h-4 w-4 rounded-full z-20"
                            style={{
                                left: `calc(${(minIndex / (values.length - 1)) * 100}% - 8px)`
                            }}
                        />

                        {/* Max thumb */}
                        <div
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const move = (ev) => handleDrag(ev, "max");
                                const up = () => {
                                    window.removeEventListener("mousemove", move);
                                    window.removeEventListener("mouseup", up);
                                };
                                window.addEventListener("mousemove", move);
                                window.addEventListener("mouseup", up);
                            }}
                            onTouchStart={(e) => {
                                const move = (ev) => handleDrag(ev, "max");
                                const end = () => {
                                    window.removeEventListener("touchmove", move);
                                    window.removeEventListener("touchend", end);
                                };
                                window.addEventListener("touchmove", move);
                                window.addEventListener("touchend", end);
                            }}
                            onMouseUp={() => props.HandleFilterChange([paramFieldType, props.filterName, [values[minIndex], values[maxIndex]]])}
                            className="absolute top-1/2 -translate-y-1/2 bg-violet-600 h-4 w-4 rounded-full z-20"
                            style={{
                                left: `calc(${(maxIndex / (values.length - 1)) * 100}% - 8px)`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}