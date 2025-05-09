import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import SidebarView from "../views/SidebarView.jsx";
import transcriptScraperFunction from "./UploadTranscriptPresenter.jsx";
import { useState } from "react";

const SidebarPresenter = observer(({ model }) => {

    useEffect(() => {
        model.setFiltersChange();
    });

    let currentLanguageSet = model.filterOptions.language;
    let currentLevelSet = model.filterOptions.level;
    let currentPeriodSet = model.filterOptions.period;
    let currentDepartmentSet = model.filterOptions.department;
    let currentLocationSet = model.filterOptions.location

    function handleLanguageFilterChange(param) {
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
        currentPeriodSet[param] = !currentPeriodSet[param];
        model.updatePeriodFilter(currentPeriodSet);
        model.setFiltersChange();
    }

    function handleLocationFilterChange(param) {
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
                console.log(param[2]);
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
                console.log("language filter set to: " + param[1]);
                model.setApplyLanguageFilter(param[1]);
                break;
            case "level":
                console.log("level filter set to: " + param[1]);
                model.setApplyLevelFilter(param[1]);
                break;
            case "location":
                console.log("location filter set to: " + param[1]);
                model.setApplyLocationFilter(param[1]);
                break;
            case "credits":
                console.log("credits filter set to: " + param[1]);
                model.setApplyCreditsFilter(param[1]);
                break;
            case "transcript":
                console.log("transcript filter set to: " + param[1]);
                model.setApplyTranscriptFilter(param[1]);
                break;
            case "department":
                console.log("department filter set to: " + param[1]);
                model.setApplyDepartmentFilter(param[1]);
                break;
            case "period":
                console.log("period filter set to: " + param[1]);
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

    //==========================================================

    const [errorMessage, setErrorMessage] = useState(""); // Stores error message
    const [errorVisibility, setErrorVisibility] = useState("hidden"); // Controls visibility
    const [fileInputValue, setFileInputValue] = useState(""); // Controls upload field state

    const handleFileChange = (event) => {
        const  truncatedCourses = model.courses.map(({ id, name }) => ({ id, name }));
        console.log(truncatedCourses);
        const file = event.target.files[0];
        //document.getElementById('PDF-Scraper-Error').style.visibility = "visible";
        transcriptScraperFunction(file, setErrorMessage, setErrorVisibility, truncatedCourses);
        //document.getElementById('PDF-Scraper-Input').value = '';
        setFileInputValue('');

        reApplyFilter();
    };
    //==========================================================

    return (
        <SidebarView HandleFilterChange={HandleFilterChange}
            HandleFilterEnable={HandleFilterEnable}
            reApplyFilter={reApplyFilter}
            toggleRemoveNull={setApplyRemoveNullCourses}

            initialApplyTranscriptFilter={model.filterOptions.applyTranscriptFilter}
            initialTranscriptElegiblityValue={model.filterOptions.eligibility}
            
            initialLanguageFilterOptions={currentLanguageSet}
            initialLanguageFilterEnable={model.filterOptions.applyLanguageFilter}

            initialLevelFilterOptions={currentLevelSet}
            initialLevelFilterEnable={model.filterOptions.applyLevelFilter}

            initialPeriodFilterOptions={currentPeriodSet}
            initialPeriodFilterEnable={model.filterOptions.applyPeriodFilter}

            initialDepartmentFilterOptions={currentDepartmentSet}
            initialDepartmentFilterEnable={model.filterOptions.applyDepartmentFilter}
            DepartmentFilterField = {model.formatDepartments()}

            initialLocationFilterOptions={currentLocationSet}
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