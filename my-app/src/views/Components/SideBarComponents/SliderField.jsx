import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import FilterEnableCheckbox from "./FilterEnableCheckbox";
import Tooltip from "./ToolTip";
import Slider from '@mui/material/Slider';


/**
 * A slider component used to select the credits in the SidebarView.
 * @param {} props 
 * @returns 
 */
export default function UploadField(props) {
    let paramFieldType = "slider";

    const values = useMemo(() => [
        0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
        6, 7, 7.5, 8, 8.5, 9, 10, 11, 12, 13.5,
        14, 15, 20, 22.5, 30, 45
    ], []);

    const [value, setValue] = useState([0,values.length-1]);

    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(values.length - 1);
    const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
    const sliderRef = useRef(null);
    const checkboxRef = useRef(null);

    const [isChanging, setChanging] = useState(false);

    useEffect(()=>{
        
        if (!isChanging && props.initialValues && props.initialValues[0] != 0) {
            console.log(props.initialValues);
            setValue([values.indexOf(values.find((c) => c == props.initialValues[0])), values.indexOf(values.find((c) => c == props.initialValues[1]))]);
            setChanging(true);
        }
    }, [props.initialValues, isChanging])

   /* useState(() => {
        setValue(props.initialValues);
        for (let i = 0; i < values.length; i++) {
            if (values[i] === props?.initialValues[0]) {
                setMinIndex(i);
            }
            if (values[i] === props?.initialValues[1]) {
                setMaxIndex(i);
            }
        }
        
    }, [props.initialValues]); // Empty dependency array ensures this runs only once*/


    const handleChange = (event, newValue) => {
        setValue(newValue);
        const [min, max] = [...newValue];
        setMinIndex(min);
        setMaxIndex(max);
    };

    const handleCommit = (event, newValue) => {
        const [minIndex, maxIndex] = newValue;
        props.HandleFilterChange([paramFieldType, props.filterName, [values[minIndex], values[maxIndex]]]);
    };
    

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
                        Credits: {(values[minIndex]==props.initialValues[0]) ? values[minIndex] : props.initialValues[0]} – {(values[maxIndex]==props.initialValues[1]) ? values[maxIndex] : props.initialValues[1]}
                    </div>

                    {/* SLIDER */}
                    <Slider
                        
                        getAriaLabel={() => 'Temperature range'}
                        value={value}
                        min={0}
                        max={values.length - 1}
                        onChange={handleChange}
                        onChangeCommitted={handleCommit} 
                    
                        marks={values.slice(0, 45 + 1).map((_, idx) => ({ value: idx }))}
                        step={1}
                        

                        sx={{
                            boxSizing: 'border-box',
                            width: '100%',
                            color: '#8e51ff',
                            height: 8,
                            '& .MuiSlider-thumb': {
                              width: 20,
                              height: 20,
                              backgroundColor: '#8e51ff',
                            },
                            '& .MuiSlider-track': {
                              border: 'none',
                            },
                            '& .MuiSlider-rail': {
                              opacity: 0.3,
                              backgroundColor: '#8e51ff',
                            },
                          }}
                    />
                </div>
            </div>
        </div>
    );
}