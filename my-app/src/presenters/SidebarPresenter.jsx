import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";

import SidebarView from "../views/SidebarView.jsx";
import transcriptScraperFunction from "./UploadTranscriptPresenter.jsx";
import { useState } from "react";
import { FilterPresenter } from './FilterPresenter.jsx';

const SidebarPresenter = observer(({ model }) => {
    
    const filter = new FilterPresenter(model);

    //let currentLanguageSet = model.filterOptions.language;
    let currentLevelSet = model.filterOptions.level;
    let currentPeriodSet = model.filterOptions.period;
    let currentDepartmentSet = model.filterOptions.department;
    let currentLocationSet = model.filterOptions.location;

    
    useEffect(() => {
        model.setFiltersChange();
        filter.filterCourses();
    },[model]);

    useEffect(() => {
        const disposer = reaction(
            () => ({
                language: model.filterOptions.language,
                level: model.filterOptions.level,
                period: model.filterOptions.period,
                department: model.filterOptions.department,
                location: model.filterOptions.location,
                credits: [model.filterOptions.creditMin, model.filterOptions.creditMax],
            }),
            (filterOptions) => {
                console.log('Filter options changed:', filterOptions);
                filter.filterCourses();
            },
            { fireImmediately: true }
        );
    
        return () => disposer();
    }, [model, filter]);

    function handleLanguageFilterChange(param) {
        if (param === "English") {
            switch (model.filterOptions.language) {
                case "none":
                    model.filterOptions.language = "english";
                    break;
                case "swedish":
                    model.filterOptions.language = "both";
                    break;
                case "english":
                    model.filterOptions.language = "none";
                    break;
                case "both":
                    model.filterOptions.language = "swedish";
                    break;
                default:
                    console.log("Invalid language filter value");
            }
        } else if (param === "Swedish") {
            switch ( model.filterOptions.language) {
                case "none":
                     model.filterOptions.language = "swedish";
                    break;
                case "english":
                     model.filterOptions.language = "both";
                    break;
                case "swedish":
                     model.filterOptions.language = "none";
                    break;
                case "both":
                     model.filterOptions.language = "english";
                    break;
                default:
                    console.log("Invalid language filter value");
            }
        }
        model.updateLanguageFilter( model.filterOptions.language);
    }
    function handleLevelFilterChange(param) {

        if (!model.filterOptions.level.includes(param)) {
            model.filterOptions.level.push(param);
        } else {
            const index = model.filterOptions.level.indexOf(param);
            if (index > -1) {
                model.filterOptions.level.splice(index, 1);
            }
        }
        model.updateLevelFilter(model.filterOptions.level);
    }

    function handleDepartmentFilterChange(param) {
        if (model.filterOptions.department.includes(param)) {
            const index = model.filterOptions.department.indexOf(param);
            if (index > -1) {
                model.filterOptions.department.splice(index, 1);
            }
        } else {
            model.filterOptions.department.push(param);
        }
        model.updateDepartmentFilter(model.filterOptions.department);
        model.setFiltersChange();
    }

    function handlePeriodFilterChange(param) {
        model.filterOptions.period[param] = !model.filterOptions.period[param];
        model.updatePeriodFilter(model.filterOptions.period);
    }

    function handleLocationFilterChange(param) {
        if (model.filterOptions.location.includes(param)) {
            const index = model.filterOptions.location.indexOf(param);
            if (index > -1) {
                model.filterOptions.location.splice(index, 1);
            }
        } else {
            model.filterOptions.location.push(param);
        }
        model.updateLocationFilter(model.filterOptions.location);
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
        filter.filterCourses();
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
        model.setFiltersChange();
    };
    //==========================================================
    filter.filterCourses();
    return (
        <SidebarView HandleFilterChange={HandleFilterChange}
            HandleFilterEnable={HandleFilterEnable}
            reApplyFilter={reApplyFilter}
            toggleRemoveNull={setApplyRemoveNullCourses}

            initialApplyTranscriptFilter={model.filterOptions.applyTranscriptFilter}
            initialTranscriptElegiblityValue={model.filterOptions.eligibility}
            
            initialLanguageFilterOptions={ model.filterOptions.language}
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