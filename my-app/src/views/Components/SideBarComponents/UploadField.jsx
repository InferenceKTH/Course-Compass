import React, { useState, useRef } from "react";
import CourseTranscriptList from './CourseTranscriptList';
import FilterEnableCheckbox from "./FilterEnableCheckbox";
//import * as scraper from '../../../../src/scripts/transcript-scraper/transcript-scraper.js';
import ButtonGroupField from './ButtonGroupField';
import ToolTip from './ToolTip';

export default function UploadField(props) {

    const [isDragging, setIsDragging] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(props.filterEnable);
    const [fileUploaded, setfileUploaded] = useState(localStorage.getItem("completedCourses") != undefined);

    const checkboxRef = useRef(null);

    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent default behavior (to allow drop)
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
            props.handleFileChange({ target: { files: event.dataTransfer.files } });
        }
    };

    return (
        <div className='pb-3 px-8 '>
            <div className="mb-0 text-white flex justify-between">
                <div className="flex-auto items-center text-wrap">
                    <h3>{String(props.filterName).charAt(0).toUpperCase() + String(props.filterName).slice(1)} scraper</h3>
                </div>

                <div className={`pt-1 flex-none ${!fileUploaded? "hidden" : ""}`}>

                    <FilterEnableCheckbox
                        ref={checkboxRef}
                        initialValue={filterEnabled}
                        onToggle={() => {
                            setFilterEnabled(!filterEnabled);
                            props.HandleFilterEnable(["transcript", !filterEnabled]);
                        }} 
                    />
                </div>
            </div>
            <div className={`${(!fileUploaded) ? ("opacity-100") : (filterEnabled? "opacity-100": "opacity-50")}`} onClick={() => {
                if (!filterEnabled && checkboxRef.current) {
                    checkboxRef.current.click();
                }
            }}>
                <div className={`flex items-center justify-center border-4 border-dashed rounded-lg cursor-pointer transition-colors 
                            ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-[#aba8e0]"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}>
                    <label htmlFor="PDF-Scraper-Input" className="flex flex-col items-stretch justify-baseline w-full h-50 rounded-lg cursor-pointer bg-[#aba8e0] hover:bg-gray-400">
                        <div className='flex-none self-end mr-3 pt-2'>
                            <ToolTip
                                text={"This is the transcript scraper, it takes in a National Transcript of Records from KTH and based on the courses you have passed, you can filter out the suggested courses. This filtering can be applied at three stages."}
                                position="left"
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center pt-5">
                            <img src="..\..\..\..\src\assets\upload.gif" alt="Upload GIF" className="object-contain" />
                            <p className=" text-sm "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs">KTH transcript of records in PDF format</p>
                        </div>
                        <input id="PDF-Scraper-Input" type="file" className="hidden" onChange={props.handleFileChange} />
                    </label>
                </div>
                <ButtonGroupField
                    items={["Weak", "Moderate", "Strong"]}
                    HandleFilterChange={props.HandleFilterChange}
                    initialValue={props.initialValue}
                />
            </div>
            <div className='max-w-70'>
                <pre id="PDF-Scraper-Error" className={`text-red-500 text-xs text-wrap ${props.errorVisibility}`}>
                    {props.errorMessage}
                </pre>
            </div>
            <div className={`${(filterEnabled? "opacity-100": "opacity-50")} ${filterEnabled ? "pointer-events-auto" : "pointer-events-none user-select-none"
                }`}>
                <CourseTranscriptList
                    reApplyFilter={props.reApplyFilter}
                />
            </div>
        </div>
    );
}

