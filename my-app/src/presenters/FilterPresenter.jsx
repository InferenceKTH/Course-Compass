import { observer } from "mobx-react-lite";
import { useMemo, useEffect } from "react";
import eligibility from "../scripts/eligibility_refined.js";

/* FilterPresenter is responsible for applying the logic necessary to filter out the courses from the overall list */
export class FilterPresenter{
   
    /* global variable for the scope of this presenter, all the smaller functions depend on it instead of passing it back and forth as params */

    constructor(model){
        this.localFilteredCourses = [...model?.courses];
        this.model = model;
    };

    filterCourses() {
        if (this.model.courses.length === 0 || !this.model.filtersChange) {
            return this.model.filteredCourses;
        }
        
        if (this.model.filterOptions.applyRemoveNullCourses) {
            this.updateNoNullcourses();
        }
        if(this.model.filterOptions.applyPeriodFilter){
            this.updatePeriods();
        }
        if (this.model.filterOptions.applyLocationFilter) {
            this.updateLocations();
        }
        if (this.model.filterOptions.applyLevelFilter) {
            this.updateLevels();
        }
        if (this.model.filterOptions.applyLanguageFilter) {
            this.updateLanguages();
        }
        if (this.model.filterOptions.applyCreditsFilter) {
            this.updateCredits();
        }
        if (this.model.filterOptions.applyTranscriptFilter) {
            this.applyTranscriptEligibility();
        }
        if (this.model.filterOptions.applyDepartmentFilter) {
            this.updateDepartments();
        }
        this.model.filtersChange = false;
        this.model.setFiltersCalculated();
        this.model.filteredCourses = this.localFilteredCourses;

    };

    // useEffect(() => {
    //     model.setFilteredCourses(filteredCourses);
    // }, [filteredCourses]);

    /*  functions declared here are generally things the main function of this observer takes and runs if the given filters are enabled,
     *  this is determined through model.filterOptions.apply*Insert filter name* flags.
     *  This presenter should be changed such that it uses side-effects instead model.filtersChange flag, since
     */

    /* functions  */
    applyTranscriptEligibility() {
        if (this.localFilteredCourses.length == 0)
            return;

        /* this should be either weak/moderate/strong */
        const eligibilitytype = this.model.filterOptions.eligibility;

        /* I am doing this trick in a multitude of filters, essentially the best fitting courses should appear first in the
         * list view on the right side, so we just filter for those and at the very end merge them back together into a single array
         */
        let strongcourses = [];
        let zerocourses = [];
        let moderatecourses = [];
        let weakcourses = [];

        let storedFinishedCourses = [];

        if (localStorage.getItem("completedCourses"))
            storedFinishedCourses = JSON.parse(localStorage.getItem("completedCourses")).map(obj => String(obj.id));


        this.localFilteredCourses.forEach(course => {
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

        /* If user selects strong matching he should get all courses which might be strongly fitting (so strong courses and zero/missing prereq courses) */
        switch (eligibilitytype) {
            case "strong":
                {
                    this.localFilteredCourses = [...strongcourses, ...zerocourses];
                    break;
                }
            case "moderate":
                {
                    this.localFilteredCourses = [...strongcourses, ...moderatecourses, ...zerocourses];
                    break;
                }
            case "weak":
                {
                    this.localFilteredCourses = [...strongcourses, ...moderatecourses, ...weakcourses, ...zerocourses];
                    break;
                }
            default:
                {
                    console.log("Error: somehow we got into a state where model.eligibility is not either \"strong\"/\"moderate\"/\"weak\".");
                    this.localFilteredCourses = [];
                    break;
                }
        }


    }

    updatePeriods(){
        if (this.localFilteredCourses.length == 0)
            return;
        
        const periodArr = [...this.model.filterOptions.period]; //has 4 boolean values one for each period
        //  [true, false, false, false] means we are only looking for P1 courses.
        let bestcourses = [];
        let worstcourses = [];
        bestcourses = this.localFilteredCourses.filter(function (course){
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

        worstcourses = this.localFilteredCourses.filter(function (course){
            return (course?.periods === undefined);
        })

        this.localFilteredCourses = [...bestcourses, ...worstcourses];


    }

    updateCredits() {
        if (this.localFilteredCourses.length == 0)
            return;
        const min = this.model.filterOptions.creditMin;
        const max = this.model.filterOptions.creditMax;

        this.localFilteredCourses = this.localFilteredCourses.filter(function (course) {
            try {
                return ((course?.credits >= min) && (course?.credits <= max));
            } catch (error) {
                console.log("for some reason course?.credits is: ", course?.credits, error);
                return false;
            }

        });
    }

    updateLocations() {
        //possible locations:  'null', 'KTH Campus', 'KTH Kista', 'AlbaNova', 'KTH Flemingsberg', 'KTH Solna', 'KTH Södertälje', 'Handelshögskolan', 'KI Solna', 'Stockholms universitet', 'KONSTFACK'
        //model.filterOptions.location is an array of locations the user toggled on, just like with academic level

        const locations = this.model.filterOptions?.location;
        let bestCourses = [];
        let worstCourses = [];

        bestCourses = this.localFilteredCourses.filter(function (course) {
            try {
                return (locations.includes(course?.location?.toUpperCase()));
            } catch (error) {
                console.log("for some reason course?.location is: ", course, error);
                return false;
            }

        });
        worstCourses = this.localFilteredCourses.filter(function (course) {
            try {
                return (course?.location === undefined);
            } catch (error) {
                console.log("BIG ERROR", error);
                return false;
            }

        });

        this.localFilteredCourses = [...bestCourses, ...worstCourses];

    }

    updateLanguages() {
        if (this.localFilteredCourses.length == 0)
            return;
        //possible model.filterOptions.languages values: "none"/"english"/"swedish"/"both"
        const languages = this.model.filterOptions.language;
        let data = [...this.localFilteredCourses];
        let bestCourses = [];
        let middleCourses = [];
        let worstCourses = [];

        //in the database a course can have
        //course?.language.english (true/false/undefined)
        //course?.language.swedish (true/false/undefined)

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
                            console.log("BIG ERROR", error, course);
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log("BIG ERROR", error, course);
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
                            console.log("BIG ERROR", error, course);
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log("BIG ERROR", error, course);
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
                            console.log("BIG ERROR", error, course);
                            return false;
                        }

                    }
                    );
                    middleCourses = data.filter(function (course) {
                        try {
                            return (((course?.language?.english === true) && (course?.language?.swedish === false))
                                || ((course?.language?.english === false) && (course?.language?.swedish === true)));
                        } catch (error) {
                            console.log("BIG ERROR", error, course);
                            return false;
                        }

                    }
                    );
                    worstCourses = data.filter(function (course) {
                        try {
                            return (course?.language === undefined);
                        } catch (error) {
                            console.log("BIG ERROR", error, course);
                            return false;
                        }

                    });
                    break;
                }
        }

        this.localFilteredCourses = [...bestCourses, ...middleCourses, ...worstCourses];
    }

    updateLevels() {
        if (this.localFilteredCourses.length == 0)
            return;

        //the possible values are: "PREPARATORY", "BASIC", "ADVANCED", "RESEARCH"
        //model.filterOptions.level is an array. it can have []
        const levels = this.model.filterOptions.level;


        this.localFilteredCourses = this.localFilteredCourses.filter(course => levels.includes(course?.academicLevel));

    }

    updateDepartments() {
        const departments = this.model.filterOptions.department;
        let bestCourses = [];
        let worstCourses = [];

        bestCourses = this.localFilteredCourses.filter(function (course) {
            try {
                return (departments.includes(course?.department));
            } catch (error) {
                console.log("for some reason course?.department is: ", course?.department, error);
                return false;
            }

        });
        worstCourses = this.localFilteredCourses.filter(function (course) {
            try {
                return (course?.department === undefined);
            } catch (error) {
                console.log("BIG ERROR", error, course);
                return false;
            }

        });

        this.localFilteredCourses = [...bestCourses, ...worstCourses];
    }

    /* Function that deals with removing the courses that have no properties or have null properties in the categories the user 
     * using for filtering. The "null" check is a remainder from a version where we didn't use the ?. property accessing yet,
     * should be able to be removed without problem in the future.
    */
    updateNoNullcourses(){
        let local = [...this.localFilteredCourses];


        if(this.model.filterOptions.applyPeriodFilter){
            local = local.filter(function(course){
                return (course?.periods && (course?.periods !== "null"));
            })
        }
        if(this.model.filterOptions.applyTranscriptFilter){
            local = local.filter(function(course){
                return (course?.prerequisites && (course?.prerequisites !== "null"));
            })
        }
        if(this.model.filterOptions.applyLevelFilter){
            local = local.filter(function(course){
                return (course?.academicLevel && (course?.academicLevel !== "null"));
            })
        }
        if(this.model.filterOptions.applyLanguageFilter){
            local = local.filter(function(course){
                return ((course?.language) && ((course?.language?.swedish !== "null") && (course?.language?.english !== "null")));
            })
        }
        if(this.model.filterOptions.applyLocationFilter){
            local = local.filter(function(course){
                return ((course?.location) && (course?.location !== "null"));
            })
        }
        if(this.model.filterOptions.applyCreditsFilter){
            local = local.filter(function(course){
                return ((course?.credits) && (course?.credits !== "null"));
            })
        }
        if(this.model.filterOptions.applyDepartmentFilter){
            local = local.filter(function(course){
                return ((course?.department) && (course?.department !== "null"));
            })
        }

        this.localFilteredCourses = [...local];
    }

    /* function that should run every single time the model changes (see note below) */
    /*  the problem is that unless using sideeffects, the run() not being async and/or it setting the filterschange = false very early can mean
     *  that 0 courses will get put into the model.filtered courses (which is the list of courses getting passed to search, and then listview)
     *  therefore TODO: rework it to stop using this dumb flags we started before learning anything about react,observers,js
    */
    // run();
    
}
