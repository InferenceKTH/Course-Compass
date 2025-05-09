import { useState } from "react";
import { useRef, useEffect } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function MultipleChoiceButtons(props) {
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [selectedItems, setSelectedItems] = useState(props.initialValues || []);
    
    const checkboxRef = useRef(null);

    useEffect(() => {
        setFilterEnabled(props.filterEnable);
    })

    const handleClick = (index) => {
        setSelectedItems((prev) => {
            if (!Array.isArray(prev) || index < 0 || index >= prev.length) {
                console.warn("Invalid selectedItems or index:", prev, index);
                return prev;
            }
    
            const updated = [...prev];
            updated[index] = !updated[index];
            props.HandleFilterChange(["buttongroup", "period", index, updated[index]]);
            return updated;
        });
    };

    const getButtonClasses = (index) => {
        if (!selectedItems || !Array.isArray(selectedItems)) {
            return "default-button-class"; // Fallback class if selectedItems is invalid
        }

        if (index < 0 || index >= selectedItems.length) {
            return "default-button-class"; // Fallback class for invalid index
        }

        const baseClasses = `flex-auto py-1 px-4 inline-flex items-center gap-x-2 text-sm
      font-medium focus:z-10 border border-gray-200 shadow-2xs hover:bg-[#8785ac]
      focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none pl-8`;
        const activeClass = selectedItems[index] ? "bg-violet-500" : "bg-transparent";
        const roundedClasses =
            index === 0
                ? "rounded-l-lg"
                : index === props.items.length - 1
                    ? "rounded-r-lg"
                    : "border-l-0";
        return `${baseClasses} ${activeClass} ${roundedClasses}`;
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

                <div className="my-1">
                    <div className="flex flex-col sm:inline-flex sm:flex-row rounded-lg shadow-2xs 
      w-full items-center font-medium text-white bg-[#aba8e0]">
                        {props.items.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                className={getButtonClasses(index)}
                                onClick={() => handleClick(index)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
}