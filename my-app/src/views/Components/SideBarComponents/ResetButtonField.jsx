import { useState } from "react";
import { useRef, useEffect } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function DropDownField(props) {

    const resetFiltersFunction = () => {
        console.log("meow.");
    };

    return(
        <div className="m-2">
        <button
            onClick={props.resetAllFilters}
            className="absolute justify-center text-center w-60 bottom-5 right-1/5 bg-[#DC143C] text-white px-2 py-1 rounded-4xl shadow-xl focus:outline-none hover:bg-[#800520] z-100"
            >
            Reset filters
        </button>
        </div>
    );


}