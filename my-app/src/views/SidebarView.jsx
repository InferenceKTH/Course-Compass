import React from 'react';
import ToggleField from "./Components/SideBarComponents/ToggleField.jsx";
import SliderField from "./Components/SideBarComponents/SliderField.jsx";
import DropDownField from "./Components/SideBarComponents/DropDownField.jsx";
import CollapsibleCheckboxes from './Components/SideBarComponents/CollapsibleCheckboxes.jsx';
import Tooltip from './Components/SideBarComponents/ToolTip.jsx';
import UploadField from './Components/SideBarComponents/UploadField';
import MultipleChoiceButtons from './Components/SideBarComponents/MultipleChoiceButtons.jsx';


/**
 * Represents the sidebar and consists of an upload field, dropdown field, toggle fields, sliders, etc. 
 * It shows the filters and settings for the search. The view is invoked by the SidebarPresenter.
 * @param {*} props
 */
function SidebarView(props) {
    return (
        <div className='object-center text-white p-3 pt-2  flex-col h-screen
         overflow-y-scroll overflow-x-hidden'
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #f1f1f1",
            }}
        >
            <h6 className="m-2 text-lg font-medium text-white text-center">
                Filters
            </h6>
            {/*<UploadTranscriptPresenter
                HandleFilterChange={props.HandleFilterChange}
                filterName="transcript"
                HandleFilterEnable={props.HandleFilterEnable}
                reApplyFilter={props.reApplyFilter}
                filterEnable={props.initialApplyTranscriptFilter}
                initialValue={props.initialTranscriptElegiblityValue}
            />*/}
            <UploadField
                        errorMessage={props.PdfErrorMessage}            //
                        errorVisibility={props.PdfErrorVisibility}      //
                        handleFileChange={props.PdfHandleFileChange}    //
                        fileInputValue={props.PdfFileInputValue}        //
                        HandleFilterEnable={props.HandleFilterEnable}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="transcript"
                        reApplyFilter={props.reApplyFilter}
                        filterEnable={props.initialApplyTranscriptFilter}
                        initialValue={props.initialTranscriptElegiblityValue}
                    />
            <div className='flex-auto justify-center '>
                <div className="z-10 w-100% rounded-lg justify-center pb-10" >

                    <DropDownField
                        options={["Preparatory", "Basic", "Advanced", "Research"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="level"
                        initialValues={props.initialLevelFilterOptions}
                        filterEnable = {props.initialLevelFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        description="Filter by the level of the courses. Basic courses correspond to bachelor courses, Advanced to master courses."
                    />
                    <ToggleField
                        fields={["English", "Swedish"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="language"
                        initialValues={props.initialLanguageFilterOptions}
                        filterEnable = {props.initialLanguageFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        description="Filter language. If you select both, courses which are offered both in English and Swedish are going to be on the top."
                    />


                    <MultipleChoiceButtons
                        items={["P1", "P2", "P3", "P4"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="period"
                        initialValues={props.initialPeriodFilterOptions}
                        filterEnable = {props.initialPeriodFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        description="Filter by the period a course is given, the autumn semester consists of P1 and P2, while the spring semester is P3 and P4.
                        Courses offered over multiple periods will also show up."
                    />

                    <DropDownField
                        options={props.LocationFilterField}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="location"
                        initialValues={props.initialLocationFilterOptions}
                        filterEnable = {props.initialLocationFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        description="Filter the location a course is offered. Courses offered only online may get filtered out if this option is selected."
                    />
                    <SliderField
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="credits"
                        initialValues={props.initialCreditsFilterOptions}
                        filterEnable = {props.initialCreditsFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        description="Select a range of credits (hp.) the courses shown should fall into (inclusive)"
                    />
                    <CollapsibleCheckboxes
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="department"
                        initialValues={props.initialDepartmentFilterOptions}
                        filterEnable = {props.initialDepartmentFilterEnable}
                        HandleFilterEnable={props.HandleFilterEnable}
                        fields={
                            props.DepartmentFilterField
                        }
                        description="Filter for the departments the course is given by. Useful for finding courses in a variety of specifics topics."
                    />
                    <div className='mr-3 flex justify-between'>
                        <input
                            id="excludeNullCheckbox"
                            type="checkbox"
                            defaultChecked = {props.initialApplyNullFilterEnable}
                            onChange={props.toggleRemoveNull}
                            className="mx-2 w-4 h-4 pt-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm accent-violet-600"
                        />
                        <label
                            htmlFor="excludeNullCheckbox"
                            className="text-sm font-medium text-gray-300 cursor-pointer flex-auto"
                        >
                            Exclude unidentified field courses
                        </label>
                        <div className='flex-none'>
                            <Tooltip
                                text={"Removes courses which have not available data in the fields you have applied filters on. \
                                    Recommended to increase the quality of the search, and to remove discontinued/badly maintained courses. \
                                    "}
                                position={"left"}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default SidebarView;