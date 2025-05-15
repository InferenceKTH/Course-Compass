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
            onClick={resetFiltersFunction}
            className="absolute justify-center text-center w-90 bottom-5 right-5 bg-[#DC143C] text-white px-4 py-2 rounded-md shadow-xl focus:outline-none hover:bg-[#800520] z-100"
            >
            Reset filters
        </button>
        </div>
    );


}