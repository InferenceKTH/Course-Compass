import { useState } from "react";
import { useRef, useEffect } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function ButtonGroupFullComponent(props) {
    const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
    const [selectedItems, setSelectedItems] = useState(props.initialValues);

    const handleClick = (index) => {
        const selectedItem = props.items[index];
        setSelectedItems((prevSelectedItems) => {
            return prevSelectedItems.map((item, idx) =>
                idx === index ? !item : item
            );
        });
        props.HandleFilterChange(["buttongroup", "period", index]);
    };

    const getButtonClasses = (index) => {
        if (!selectedItems || !Array.isArray(selectedItems)) {
            return "default-button-class";
        }
        if (index < 0 || index >= selectedItems.length) {
            return "default-button-class";
        }

        return selectedItems[index] ? "selected-class" : "unselected-class";
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
                    initialValue={filterEnabled}
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