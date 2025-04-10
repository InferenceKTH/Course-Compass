import React from 'react';
import CourseTranscriptList from './CourseTranscriptList';
import FilterEnableCheckbox from "./FilterEnableCheckbox";
//import * as scraper from '../../../../src/scripts/transcript-scraper/transcript-scraper.js';
import { useState } from "react";

export default function UploadField(props) {


    const [isDragging, setIsDragging] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(true);

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
        <div className='pb-5 px-8 '>
            <div className={`flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors 
                            ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-[#aba8e0]"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>
                <label htmlFor="PDF-Scraper-Input" className="flex flex-col items-center justify-center w-full h-50 border-2 
                 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#aba8e0] hover:bg-gray-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">KTH trnascript of records in PDF format</p>
                    </div>
                    <input id="PDF-Scraper-Input" type="file" className="hidden" onChange={props.handleFileChange} />
                </label>
            </div>
            <div className="mb-2 text-white flex justify-between">
                <div className="flex items-center text-wrap max-w-70">
                    <p className='text-sm opacity-50'>
                        Describe how the Transcript upload works
                    </p>
                </div>
                <div className='pt-2'>

                    <FilterEnableCheckbox
                        onToggle={() => { setFilterEnabled(!filterEnabled); props.HandleFilterEnable(["Transcript", !filterEnabled]); }}
                    />
                </div>
            </div>
            <div className='max-w-70'>
                <pre id="PDF-Scraper-Error" className={`text-red-500 text-xs text-wrap ${props.errorVisibility}`}>
                    {props.errorMessage}
                </pre>
            </div>
            <div className={`opacity-${filterEnabled ? "100" : "50"} ${filterEnabled ? "pointer-events-auto" : "pointer-events-none user-select-none"
                }`}>
                <CourseTranscriptList />
            </div>
        </div>
    );
}

