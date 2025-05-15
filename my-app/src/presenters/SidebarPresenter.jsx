import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import SidebarView from "../views/SidebarView.jsx";
import transcriptScraperFunction from "./UploadTranscriptPresenter.jsx";
import { useState } from "react";
import { use } from 'react';

const SidebarPresenter = observer(({ model }) => {
    
    useEffect(() => {
        model.setFiltersChange();
    },[model]);

    function handleLanguageFilterChange(param) {
        let currentLanguageSet = model.filterOptions.language;
        if (param === "English") {
            switch (currentLanguageSet) {
                case "none":
                    currentLanguageSet = "english";
                    break;
                case "swedish":
                    currentLanguageSet = "both";
                    break;
                case "english":
                    currentLanguageSet = "none";
                    break;
                case "both":
                    currentLanguageSet = "swedish";
                    break;
                default:
                    console.log("Invalid language filter value");
            }
        } else if (param === "Swedish") {
            switch (currentLanguageSet) {
                case "none":
                    currentLanguageSet = "swedish";
                    break;
                case "english":
                    currentLanguageSet = "both";
                    break;
                case "swedish":
                    currentLanguageSet = "none";
                    break;
                case "both":
                    currentLanguageSet = "english";
                    break;
                default:
                    console.log("Invalid language filter value");
            }
        }
        model.updateLanguageFilter(currentLanguageSet);
    }
    function handleLevelFilterChange(param) {
        
        let currentLevelSet = model.filterOptions.level;
        
        if (!currentLevelSet.includes(param)) {
            currentLevelSet.push(param);
        } else {
            const index = currentLevelSet.indexOf(param);
            if (index > -1) {
                currentLevelSet.splice(index, 1);
            }
        }
        model.updateLevelFilter(currentLevelSet);
    }

    function handleDepartmentFilterChange(param) {
        
        let currentDepartmentSet = model.filterOptions.department;
        
        if (currentDepartmentSet.includes(param)) {
            const index = currentDepartmentSet.indexOf(param);
            if (index > -1) {
                currentDepartmentSet.splice(index, 1);
            }
        } else {
            currentDepartmentSet.push(param);
        }
        model.updateDepartmentFilter(currentDepartmentSet);
        model.setFiltersChange();
    }

    function handlePeriodFilterChange(param) {
        
        let currentPeriodSet = model.filterOptions.period;
        
        currentPeriodSet[param] = !currentPeriodSet[param];
        model.updatePeriodFilter(currentPeriodSet);
        model.setFiltersChange();
    }

    function handleLocationFilterChange(param) {
        
        let currentLocationSet = model.filterOptions.location;
        
        if (currentLocationSet.includes(param)) {
            const index = currentLocationSet.indexOf(param);
            if (index > -1) {
                currentLocationSet.splice(index, 1);
            }
        } else {
            currentLocationSet.push(param);
        }
        model.updateLocationFilter(currentLocationSet);
        model.setFiltersChange();
    }

    /*HandleFilterChange param is structured as such
        [
            type of the field: (toggle, slider, dropdown, buttongroup)
            name of the filter: (level, language, location, credits)
            data to set in model
        ]
    */
    function HandleFilterChange(param) {
        switch (param[1]) {
            case "language":
                handleLanguageFilterChange(param[2]);
                break;
            case "level":
                handleLevelFilterChange(param[2]);
                break;
            case "location":
                handleLocationFilterChange(param[2]);
                break;
            case "credits":
                model.updateCreditsFilter(param[2]);
                break;
            case "eligibility":
                model.updateTranscriptElegibilityFilter(param[2].toLowerCase());
                break;
            case "department":
                handleDepartmentFilterChange(param[2]);
                break;
            case "period":
                handlePeriodFilterChange(param[2]);
                break;
            default:
                console.log("Invalid filter type");
        }
        model.setFiltersChange();
    }

    /*HandleFilterEnable param is structured as such
        [
            name of the filter: (level, language, location, credits)
            value: (true/false)
        ]
    */
    function HandleFilterEnable(param) {
        switch (param[0]) {
            case "language":
                model.setApplyLanguageFilter(param[1]);
                break;
            case "level":
                model.setApplyLevelFilter(param[1]);
                break;
            case "location":
                model.setApplyLocationFilter(param[1]);
                break;
            case "credits":
                model.setApplyCreditsFilter(param[1]);
                break;
            case "transcript":
                model.setApplyTranscriptFilter(param[1]);
                break;
            case "department":
                model.setApplyDepartmentFilter(param[1]);
                break;
            case "period":
                model.setApplyPeriodFilter(param[1]);
                break;
            default:
                console.log("Invalid filter type");
        }
        model.setFiltersChange();
    }
    function reApplyFilter() {
        model.setFiltersChange();
    }

    function setApplyRemoveNullCourses(){
        model.setApplyRemoveNullCourses();
    }

    function formatDepartmentSet(departmentSet) {
        const grouped = departmentSet.reduce((acc, item) => {
            if (item.includes("/")) {
                const [school, department] = item.split("/");
                if (!acc[school]) {
                    acc[school] = [];
                }
                acc[school].push(department?.trim());
                return acc;
            } else {
                const [school] = item;
                if (!acc[school]) {
                    acc[school] = [];
                }
                return acc;
            }
        }, {});
        const sortedGrouped = Object.keys(grouped)
        .sort()
        .reduce((acc, key) => {
            acc[key] = grouped[key].sort();
            return acc;
        }, {});
        const fields = Object.entries(sortedGrouped).map(([school, departments], index) => ({
            id: index + 1,
            label: school,
            subItems: departments,
        }));
        return fields;
    }

    //==========================================================

    const [errorMessage, setErrorMessage] = useState(""); // Stores error message
    const [errorVisibility, setErrorVisibility] = useState("hidden"); // Controls visibility
    const [fileInputValue, setFileInputValue] = useState(""); // Controls upload field state

    const handleFileChange = (event) => {
        const  truncatedCourses = model.courses.map(({ id, name }) => ({ id, name }));
        const file = event.target.files[0];
        document.getElementById('PDF-Scraper-Error').style.visibility = "visible";
        transcriptScraperFunction(file, setErrorMessage, setErrorVisibility, reApplyFilter, truncatedCourses);
        document.getElementById('PDF-Scraper-Input').value = '';
        setFileInputValue('');

        
    };

    const [initialSliderValues, setInitialSliderValues] = useState([0.5,45]);
    useEffect(()=>{
            setInitialSliderValues([model.filterOptions.creditMin, model.filterOptions.creditMax]);
    }, [])
    //==========================================================

    return (
        <SidebarView HandleFilterChange={HandleFilterChange}
            HandleFilterEnable={HandleFilterEnable}
            reApplyFilter={reApplyFilter}
            toggleRemoveNull={setApplyRemoveNullCourses}

            initialApplyTranscriptFilter={model.filterOptions.applyTranscriptFilter}
            initialTranscriptElegiblityValue={model.filterOptions.eligibility}
            
            initialLanguageFilterOptions={model.filterOptions.language}
            initialLanguageFilterEnable={model.filterOptions.applyLanguageFilter}

            initialLevelFilterOptions={model.filterOptions.level}
            initialLevelFilterEnable={model.filterOptions.applyLevelFilter}

            initialPeriodFilterOptions={model.filterOptions.period}
            initialPeriodFilterEnable={model.filterOptions.applyPeriodFilter}

            initialDepartmentFilterOptions={formatDepartmentSet(model.filterOptions.department.filter(item => item !== "undefined/undefined"))}
            initialDepartmentFilterEnable={model.filterOptions.applyDepartmentFilter}
            DepartmentFilterField = {model.formatDepartments()}

            initialLocationFilterOptions={model.filterOptions.location}
            initialLocationFilterEnable={model.filterOptions.applyLocationFilter}
            LocationFilterField = {model.locations}

            initialCreditsFilterOptions={[model.filterOptions.creditMin, model.filterOptions.creditMax]}
            initialCreditsFilterEnable={model.filterOptions.applyCreditsFilter}

            initialApplyNullFilterEnable={model.filterOptions.applyRemoveNullCourses }

            //==========================================================

            PdfErrorMessage={errorMessage}
            PdfErrorVisibility={errorVisibility}
            PdfHandleFileChange={handleFileChange}
            PdfFileInputValue={fileInputValue}

            //==========================================================
        />
    );
});

export { SidebarPresenter };