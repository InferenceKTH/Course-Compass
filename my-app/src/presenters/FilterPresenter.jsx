import React from 'react';
import { observer } from "mobx-react-lite";
import eligibility from "../scripts/eligibility_refined.js";
import { SearchbarPresenter } from './SearchbarPresenter.jsx';

/* FilterPresenter is responsible for applying the logic necessary to filter out the courses from the overall list */
const FilterPresenter = observer(({ model }) => {
    /* global variable for the scope of this presenter, all the smaller functions depend on it instead of passing it back and forth as params */
    var localFilteredCourses = []; //might need to declare out of scope. idk js


    function applyTranscriptEligibility() {
        if (localFilteredCourses.length == 0)
            return;

        /*  */
        const eligibilitytype = model.filterOptions.eligibility;

        let strongcourses = [];
        let zerocourses = [];
        let moderatecourses = [];
        let weakcourses = [];

        let storedFinishedCourses = [];

        if (localStorage.getItem("completedCourses"))
            storedFinishedCourses = JSON.parse(localStorage.getItem("completedCourses"));


        localFilteredCourses.forEach(course => {
            if (storedFinishedCourses.includes(course?.code))
                return;
            if (course?.prerequisites && (course?.prerequisites !== "null"))
                var resultEligibility = eligibility(storedFinishedCourses, course?.prerequisites);
            else { // {strong: , zero: , moderate: , weak: }
                zerocourses.push(course);
                return;
            }
            if (resultEligibility.strong) {
                strongcourses.push(course);
                return;
            } else if (resultEligibility.zero) {
                zerocourses.push(course);
                return;
            } else if (resultEligibility.moderate) {
                moderatecourses.push(course);
                return;
            } else if (resultEligibility.weak) {
                weakcourses.push(course);
                return;
            } else {
                //it's not eligible at all
                return;
            }

        });

        switch (eligibilitytype) {
            case "strong":
                {
                    localFilteredCourses = [...strongcourses, ...zerocourses];
                    break;
                }
            case "moderate":
                {
                    localFilteredCourses = [...strongcourses, ...moderatecourses, ...zerocourses];
                    break;
                }
            case "weak":
                {
                    localFilteredCourses = [...strongcourses, ...moderatecourses, ...weakcourses, ...zerocourses];
                    break;
                }
            default:
                {
                    console.log("Error: somehow we got into a state where model.eligibility is no \"strong\"/\"moderate\"/\"weak\".");
                    localFilteredCourses = [];
                    break;
                }
        }


    }

    function updatePeriods(){
        
        if (localFilteredCourses.length == 0)
            return;
        
        const periodArr = [...model.filterOptions.period]; //has 4 boolean values one for each period
        //  [true, false, false, false] means we are only looking for P1 courses.
        let bestcourses = [];
        let worstcourses = [];
        bestcourses = localFilteredCourses.filter(function (course){
            try {
                if(course?.periods === undefined)
                    return false;
                if((course?.periods?.P1 == true) && (periodArr[0] == true))
                    return true;
                if((course?.periods?.P2 == true) && (periodArr[1] == true))
                    return true;
                if((course?.periods?.P3 == true) && (periodArr[2] == true))
                    return true;
                if((course?.periods?.P4 == true) && (periodArr[3] == true))
                    return true;
                return false;
            } catch (error) {
                console.log("for some reason course?.periods is weird: ", course?.periods, error);
                return false; 
            }
            
        })

        worstcourses = localFilteredCourses.filter(function (course){
            return (course?.periods === undefined);
        })

        localFilteredCourses = [...bestcourses, ...worstcourses];


    }

    function updateCredits() {
        if (localFilteredCourses.length == 0)
            return;
        const min = model.filterOptions.creditMin;
        const max = model.filterOptions.creditMax;

        localFilteredCourses = localFilteredCourses.filter(function (course) {
            try {
                return ((course?.credits >= min) && (course?.credits <= max));
            } catch (error) {
                console.log("for some reason course?.credits is: ", course?.credits, error);
                return false;
            }

        });
    }

    function updateLocations() {
        //possible locations:  'null', 'KTH Campus', 'KTH Kista', 'AlbaNova', 'KTH Flemingsberg', 'KTH Solna', 'KTH Södertälje', 'Handelshögskolan', 'KI Solna', 'Stockholms universitet', 'KONSTFACK'
        //model.filterOptions.location is an array of locations the user toggled on, just like with academic level

        const locations = model.filterOptions.location;
        let bestCourses = [];
        let worstCourses = [];

        bestCourses = localFilteredCourses.filter(function (course) {
            try {
                return (locations.includes(course?.location.toUpperCase()));
            } catch (error) {
                console.log("for some reason course?.location is: ", course, error);
                return false;
            }

        });
        worstCourses = localFilteredCourses.filter(function (course) {
            try {
                return (course?.location === undefined);
            } catch (error) {
                console.log("BIG ERROR", error);
                return false;
            }

        });

        localFilteredCourses = [...bestCourses, ...worstCourses];

    }

    function updateLanguages() {
        if (localFilteredCourses.length == 0)
            return;
        //possible model.filterOptions.languages values: "none"/"english"/"swedish"/"both"
        const languages = model.filterOptions.language;
        let data = [...localFilteredCourses];
        let bestCourses = [];
        let middleCourses = [];
        let worstCourses = [];

        //in the database a course can have
        //course?.language.english (true/false/undefined)
        //course?.language.swedish (true/false/undefined)

        //console.log(data);

        switch (languages) {
            case "none":
                {
                    bestCourses = data;
                    break;
                }
            case "english":
                {
                    bestCourses = data.filter(function (course) {
                        try {
                            return (course?.language?.english === true);
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR", error);
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    });
                    break;
                }
            case "swedish":
                {
                    bestCourses = data.filter(function (course) {
                        try {
                            return (course?.language?.swedish === true);
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    });
                    break;
                }
            case "both":
                { //both on reorders, the both languages are reordered both - english - swedish - null
                    bestCourses = data.filter(function (course) {
                        try {
                            return ((course?.language?.english === true) && (course?.language?.swedish === true));
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    }
                    );
                    middleCourses = data.filter(function (course) {
                        try {
                            return (((course?.language?.english === true) && (course?.language?.swedish === false))
                                || ((course?.language?.english === false) && (course?.language?.swedish === true)));
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log(course);
                            console.log("BIG ERROR");
                            return false;
                        }

                    });
                    break;
                }
        }

        localFilteredCourses = [...bestCourses, ...middleCourses, ...worstCourses];
    }

    function updateLevels() {
        if (localFilteredCourses.length == 0)
            return;

        //the possible values are: "PREPARATORY", "BASIC", "ADVANCED", "RESEARCH"
        //model.filterOptions.level is an array. it can have []
        const levels = model.filterOptions.level;


        localFilteredCourses = localFilteredCourses.filter(course => levels.includes(course?.academicLevel));

        /*
        let levels = model.filterOptions.level;
        let stayingCourses = [];
        
        for(let i=0; i<localFilteredCourses.length; i++){
            let stay = false;
            for(let j=0; j<levels.length; j++){
                if(localFilteredCourses[i].academicLevel === levels[j]){
                    stay = true;
                    break;
                }
            }
            if(stay) stayingCourses.push(localFilteredCourses[i]);
        }
        localFilteredCourses = [...stayingCourses];*/
    }

    function updateDepartments() {
        const deparments = model.filterOptions.deparment;
        let bestCourses = [];
        let worstCourses = [];

        bestCourses = localFilteredCourses.filter(function (course) {
            try {
                return (deparments.includes(course?.deparment));
            } catch (error) {
                console.log("for some reason course?.department is: ", course?.department, error);
                return false;
            }

        });
        worstCourses = localFilteredCourses.filter(function (course) {
            try {
                return (course?.department === undefined);
            } catch (error) {
                console.log("BIG ERROR", error);
                return false;
            }

        });

        localFilteredCourses = [...bestCourses, ...worstCourses];
    }

    function updateNoNullcourses(){
        let local = [...localFilteredCourses];


        if(model.filterOptions.applyPeriodFilter){
            local = local.filter(function(course){
                return (course?.periods && (course?.periods !== "null"));
            })
        }
        if(model.filterOptions.applyTranscriptFilter){
            local = local.filter(function(course){
                return (course?.prerequisites && (course?.prerequisites !== "null"));
            })
        }
        if(model.filterOptions.applyLevelFilter){
            local = local.filter(function(course){
                return (course?.academicLevel && (course?.academicLevel !== "null"));
            })
        }
        if(model.filterOptions.applyLanguageFilter){
            local = local.filter(function(course){
                return ((course?.language) && ((course?.language?.swedish !== "null") && (course?.language?.english !== "null")));
            })
        }
        if(model.filterOptions.applyLocationFilter){
            local = local.filter(function(course){
                return ((course?.location) && (course?.location !== "null"));
            })
        }
        if(model.filterOptions.applyCreditsFilter){
            local = local.filter(function(course){
                return ((course?.credits) && (course?.credits !== "null"));
            })
        }
        if(model.filterOptions.applyDepartmentFilter){
            local = local.filter(function(course){
                return ((course?.department) && (course?.department !== "null"));
            })
        }

        localFilteredCourses = [...local];
    }

    async function run() {
        if (model.courses.length == 0) {
            return;
        }
        if (model.filtersChange) {
            localFilteredCourses = [...model.courses];

            if (model.filterOptions.applyRemoveNullCourses) {
                updateNoNullcourses();
            }
            if(model.filterOptions.applyPeriodFilter){
                updatePeriods();
            }
            if (model.filterOptions.applyLocationFilter) {
                updateLocations();
            }
            if (model.filterOptions.applyLevelFilter) {
                updateLevels();
            }
            if (model.filterOptions.applyLanguageFilter) {
                updateLanguages();
            }
            if (model.filterOptions.applyCreditsFilter) {
                updateCredits();
            }
            if (model.filterOptions.applyTranscriptFilter) {
                applyTranscriptEligibility();
            }
            if (model.filterOptions.applyDepartments) {
                updateDepartments();
            }

            model.filteredCourses = [...localFilteredCourses];
            model.filtersChange = false;
            model.setFiltersCalculated();
            //console.log("filtered objects number of elements: ", model.filteredCourses.length);
        }
    }

    run();
    
});

export { FilterPresenter };