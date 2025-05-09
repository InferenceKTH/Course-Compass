import React, { useState, useRef } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";

export default function ToggleField(props) {

    let paramFieldType = "toggle";

    const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
    const [prop1Set, setprop1Set] = useState((props.initialValues=="both") || (props.initialValues==String(props.fields[0]).charAt(0).toLowerCase() + String(props.fields[0]).slice(1)));
    const [prop2Set, setprop2Set] = useState((props.initialValues=="both") || (props.initialValues==String(props.fields[1]).charAt(0).toLowerCase() + String(props.fields[1]).slice(1)));

    const checkboxRef = useRef(null);

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

            <div className={`opacity-${filterEnabled ? "100" : "50"}`} onClick={() => {
                    if (!filterEnabled && checkboxRef.current) {
                        checkboxRef.current.click();
                    }
            }}>
                <div className="flex flex-col sm:flex-row md:flex-row rounded-lg shadow-2xs w-full items-center
             font-medium text-white bg-[#aba8e0] ">
                    <label className="flex-auto py-3 px-4 inline-flex gap-x-2 -mt-px -ms-px 
                first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 s
                m:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md text-sm font-medium
                focus:z-10 border border-gray-200  shadow-2xs cursor-pointer">
                        <input type="checkbox" defaultChecked={prop1Set} className="sr-only peer" onChange={() => props.HandleFilterChange([paramFieldType, props.filterName, props.fields[0]])} />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none 
                    peer-focus:ring-4 peer-focus:ring-blue-300 
                    rounded-full peer  peer-checked:after:translate-x-full
                    rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']
                    after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border
                     after:rounded-full after:h-5 after:w-5 after:transition-all
                      peer-checked:bg-violet-500 "></div>
                        <span>{props.fields[0]}</span>
                    </label>
                    <label className="flex-auto py-3 px-4 inline-flex gap-x-2 -mt-px -ms-px 
                first:rounded-t-md last:rounded-b-md sm:first:rounded-s-md sm:mt-0 sm:first:ms-0 s
                m:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-md text-sm font-medium
                focus:z-10 border border-gray-200  shadow-2xs cursor-pointer">
                        <input type="checkbox" defaultChecked={prop2Set} className="sr-only peer" onChange={() => props.HandleFilterChange([paramFieldType, props.filterName, props.fields[1]])} />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                    peer-focus:ring-blue-300  rounded-full peer
                      peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                      peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
                      after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
                       after:h-5 after:w-5 after:transition-all  peer-checked:bg-violet-500
                        "></div>
                        <span>{props.fields[1]}</span>
                    </label>
                </div>
            </div>
        </div>
    );
}