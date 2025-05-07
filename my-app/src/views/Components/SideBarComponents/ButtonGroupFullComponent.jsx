import { useState } from "react";
import { useRef, useEffect } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function ButtonGroupFullComponent(props) {
    const [filterEnabled, setFilterEnabled] = useState(true);
    const [selectedItems, setSelectedItems] = useState(props.items);

    const [activeIndex, setActiveIndex] = useState([]);
    const handleClick = (index) => {
        const selectedItem = props.items[index];
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(selectedItem)) {
                return prevSelectedItems.filter((item) => item !== selectedItem);
            } else {
                return [...prevSelectedItems, selectedItem];
            }
        });
        props.HandleFilterChange(["buttongroup", "period", index]);
    };

    const getButtonClasses = (index) => {
        const baseClasses = `flex-auto py-1 px-4 inline-flex items-center gap-x-2 text-sm 
      font-medium focus:z-10 border border-gray-200 shadow-2xs hover:bg-[#8785ac]
      focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none pl-8`;
        const activeClass = selectedItems.includes(props.items[index]) ? "bg-violet-500" : "bg-transparent";
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
                    onToggle={() => { setFilterEnabled(!filterEnabled); props.HandleFilterEnable([props.filterName, !filterEnabled]); }}
                />
            </div>
            <div className={`opacity-${filterEnabled ? "100" : "50"} ${filterEnabled ? "pointer-events-auto" : "pointer-events-none user-select-none"
                }`}>

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