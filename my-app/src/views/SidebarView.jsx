import React from 'react';
import UploadField from "./Components/SideBarComponents/UploadField.jsx";
import ToggleField from "./Components/SideBarComponents/ToggleField.jsx";
import ButtonGroupField from "./Components/SideBarComponents/ButtonGroupField.jsx";
import SliderField from "./Components/SideBarComponents/SliderField.jsx";
import DropDownField from "./Components/SideBarComponents/DropDownField.jsx";
import { UploadTranscriptPresenter } from '../presenters/UploadTranscriptPresenter.jsx';
import CollapsibleCheckboxes from './Components/SideBarComponents/CollapsibleCheckboxes.jsx';



function SidebarView(props) {
    return (
        <div className='object-center text-white p-3 pt-2  flex-col h-screen
         overflow-y-scroll'
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #f1f1f1",
            }}
        >
            <h6 className="m-2 text-lg font-medium text-white text-center">
                Filters
            </h6>
            <UploadTranscriptPresenter
                HandleFilterChange={props.HandleFilterChange}
                filterName="transcript"
                HandleFilterEnable={props.HandleFilterEnable}
                reApplyFilter={props.reApplyFilter}
            />
            <div className='flex-auto justify-center h-100 max-h-100 '>
                <div className="z-10 w-100% rounded-lg justify-center pb-10" >

                    <DropDownField
                        options={["Preparatory", "Basic", "Advanced", "Research"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="level"
                        HandleFilterEnable={props.HandleFilterEnable}
                    />
                    <ToggleField
                        fields={["English", "Swedish"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="language"
                        HandleFilterEnable={props.HandleFilterEnable}
                    />

                    {/*expanding list for department */}

                    <DropDownField
                        options={["Kista", "Valhalavagen", "Sodetalje", "T-centralen"]}
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="location"
                        HandleFilterEnable={props.HandleFilterEnable}
                    />
                    <SliderField
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="credits"
                        HandleFilterEnable={props.HandleFilterEnable}
                    />
                    <CollapsibleCheckboxes
                        HandleFilterChange={props.HandleFilterChange}
                        filterName="department"
                        HandleFilterEnable={props.HandleFilterEnable}
                        fields={
                            [
                                {
                                    id: 1,
                                    label: "EECS",
                                    subItems: [
                                        "Computational Science and  Technology",
                                        "Theoretical Computer Science",
                                        "Electric Power and Energy Systems",
                                        "Network and Systems Engineering",
                                    ],
                                },
                                {
                                    id: 2,
                                    label: "ITM",
                                    subItems: [
                                        "Learning in Engineering Sciences",
                                        "Industrial Economics and Management",
                                        "Energy Systems",
                                        "Integrated Product Development and Design",
                                        "SKD GRU",
                                    ],
                                },
                                {
                                    id: 3,
                                    label: "SCI",
                                    subItems: [
                                        "Mathematics",
                                        "Applied Physics",
                                        "Mechanics",
                                        "Aeronautical and Vehicle Engineering",
                                    ],
                                },
                                {
                                    id: 4,
                                    label: "ABE",
                                    subItems: [
                                        "Sustainability and Environmental Engineering",
                                        "Concrete Structures",
                                        "Structural Design & Bridges",
                                        "History of Science, Technology and Environment",
                                    ],
                                },
                            ]
                        }
                    />
                    <div className='mr-3'>
                    <input
                            id="excludeNullCheckbox"
                            type="checkbox"
                            onChange={props.toggleRemoveNull}
                            className="w-4 h-4 pt-4 text-purple-600 bg-gray-100 border-gray-300 rounded-sm accent-violet-600"
                        />
                        <label 
                            htmlFor="excludeNullCheckbox" 
                            className="ml-2 text-sm font-medium text-gray-300 cursor-pointer"
                        >
                            Exclude unidentified field courses
                        </label>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SidebarView;