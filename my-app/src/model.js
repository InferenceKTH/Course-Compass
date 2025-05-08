import { addCourse, addReviewForCourse, getReviewsForCourse } from "../firebase";


export const model = {
    user: undefined,
    //add searchChange: false,   //this is for reworking the searchbar presenter, so that it triggers as a model, 
    //instead of passing searchcouses lambda function down into the searchbarview.
    /* courses returned from SearchbarPresenter (search is applied on top of filteredCourses[]) to be shown in the ListView */
    currentSearch: [],
    /* current query text */
    currentSearchText: "",
    scrollPosition: 0,
    /* list of all course objects downloaded from the Firebase realtime database and stored locally as JSON object in this array */
    courses: [],
    /* courses the user selected as their favourite */
    favourites: [],
    isReady: false,
    /* this is a boolean flag showing that filtering options in the UI have changed, triggering the FilterPresenter to recalculate the filteredCourses[] */
    filtersChange: false, 
    /* this is a flag showing if the filteredCourses[] has changed (since FilterPresenter recalculated it), so now SearchBarPresenter needs to 
    recalculate currentSearch[] depending this updated list of courses */
    filtersCalculated: false,
    /* this is the array that FilterPresenter fills up with course objects, filtered from the model.courses[] */
    filteredCourses: [], 
    /* JSON object containing all important parameters the FilterPresenter needs to calculate the filtered list of courses */
    filterOptions: {
        //apply-X-Filter boolean triggering flag wether corresponding filtering functions should run or not
        //different arrays require different data, some uses string arrays, some boolean values, and so on
        applyTranscriptFilter: true,
        eligibility: "weak",  //the possible values for the string are: "weak"/"moderate"/"strong"
        applyLevelFilter: true,
        level: ["PREPARATORY", "BASIC", "ADVANCED", "RESEARCH"], //the possible values for the array are: "PREPARATORY", "BASIC", "ADVANCED", "RESEARCH"
        applyLanguageFilter: true,
        language: "none", //the possible values for the string are: "none"/"english"/"swedish"/"both"
        applyLocationFilter:true,
        location: [], //the possible values for the array are: 'KTH Campus', 'KTH Kista', 'AlbaNova', 'KTH Flemingsberg', 'KTH Solna', 'KTH Södertälje', 'Handelshögskolan', 'KI Solna', 'Stockholms universitet', 'KONSTFACK'
        applyCreditsFilter:true,
        creditMin: 0,
        creditMax: 45,
        applyDepartmentFilter: true,
        department: ["EECS/Computational Science and  Technology", "EECS/Theoretical Computer Science", "EECS/Electric Power and Energy Systems", "EECS/Network and Systems Engineering",
        "ITM/Learning in Engineering Sciences", "ITM/Industrial Economics and Management", "ITM/Energy Systems", "ITM/Integrated Product Development and Design", "ITM/SKD GRU",
        "SCI/Mathematics", "SCI/Applied Physics", "SCI/Mechanics", "SCI/Aeronautical and Vehicle Engineering", 
        "ABE/Sustainability and Environmental Engineering", "ABE/Concrete Structures", "ABE/Structural Design & Bridges", "ABE/History of Science, Technology and Environment", ],
        applyRemoveNullCourses: false,
        period: [true, true, true, true],
        applyPeriodFilter: true
    },

    setUser(user) {
        if (!this.user)
            this.user = user;
    },

    setCurrentSearch(searchResults){
        this.currentSearch = searchResults;
    },

    setCurrentSearchText(text){
        this.currentSearchText = text;
    },
    
    setScrollPosition(position) {
        this.scrollPosition = position;
    },

    setCourses(courses){
        this.courses = courses;
    },

    async addCourse(course) {
        try {
            await addCourse(course);
            this.courses = [...this.courses, course];
        } catch (error) {
            console.error("Error adding course:", error);
        }
    },
    setFavourite(favorites){
        this.favourites = favorites;
    },

    addFavourite(course) {
        this.favourites = [...this.favourites, course];
    },

    removeFavourite(course) {
        this.favourites = (this.favourites || []).filter(fav => fav.code !== course.code);
    },

    getCourse(courseID) {
        return this.courses.find(course => course.code === courseID);
    },

    getCourseNames(courseID_array) {
        let return_obj = {};
        for (let course of this.courses) {
            if (courseID_array.includes(course.code)) {
                return_obj[course.code] = course.name;
            }
        }
        return return_obj;
    },

    populateDatabase(data) {
        if (!data || !this) {
            console.log("no model or data");
            return;
        }
        const entries = Object.entries(data);
        entries.forEach(entry => {
            const course = {
                code: entry[1].code,
                name: entry[1]?.name ?? null,
                location: entry[1]?.location ?? null,
                department: entry[1]?.department ?? null,
                language: entry[1]?.language ?? null,
                description: entry[1]?.description ?? null,
                academicLevel: entry[1]?.academic_level ?? null,
                periods: entry[1]?.periods ?? null,
                credits: entry[1]?.credits ?? 0,
                prerequisites: entry[1]?.prerequisites ?? null,
                prerequisites_text: entry[1]?.prerequisites_text ?? null,
                learning_outcomes: entry[1]?.learning_outcomes ?? null
            };
            this.addCourse(course);
        });
    },
    //for reviews
    async addReview(courseCode, review) {
        try {
            await addReviewForCourse(courseCode, review);

        } catch (error) {
            console.error("Error adding review:", error);
        }
    },
    
    async getReviews(courseCode) {
        try {
            return await getReviewsForCourse(courseCode);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },
    //for filters

    setFiltersChange() {
        this.filtersChange = true;
    },

    setFiltersCalculated() {
        this.filtersCalculated = true;
    },

    setFilterOptions(options){
        this.filterOptions = options; // do we want to set the flags? What about useEffect?
    },

    setApplyRemoveNullCourses() {
        this.filterOptions.applyRemoveNullCourses = !this.filterOptions.applyRemoveNullCourses;
        this.setFiltersChange();
    },
    
    setApplyRemoveNullCourses() {
        this.filterOptions.applyRemoveNullCourses = !this.filterOptions.applyRemoveNullCourses;
        this.setFiltersChange();
    },

    updateLevelFilter(level) {
        this.filterOptions.level = level;
    },

    updateDepartmentFilter(department) {
        this.filterOptions.department = department;
    },

    updateLanguageFilter(languages) {
        this.filterOptions.language = languages;
    },
    updateLocationFilter(location) {
        this.filterOptions.location = location;
    },
    updateCreditsFilter(creditLimits) {
        this.filterOptions.creditMin = creditLimits[0];
        this.filterOptions.creditMax = creditLimits[1];
    },
    updateTranscriptElegibilityFilter(eligibility) {
        this.filterOptions.eligibility = eligibility;
    },

    updateDepartmentFilter(department) {
        this.filterOptions.department = department;
    },

    updatePeriodFilter(period) {
        this.filterOptions.period = period;
    },

    setApplyTranscriptFilter(transcriptFilterState) {
        this.filterOptions.applyTranscriptFilter = transcriptFilterState;
    },
    setApplyLevelFilter(levelFilterState) {
        this.filterOptions.applyLevelFilter = levelFilterState;
    },
    setApplyLanguageFilter(languageFilterState) {
        this.filterOptions.applyLanguageFilter = languageFilterState;
    },
    setApplyLocationFilter(locationFilterState) {
        this.filterOptions.applyLocationFilter = locationFilterState;
    },
    setApplyCreditsFilter(creditsFilterState) {
        this.filterOptions.applyCreditsFilter = creditsFilterState;
    },
    setApplyDepartmentFilter(departmentFilterState) {
        this.filterOptions.applyDepartmentFilter = departmentFilterState;
    },
    setApplyPeriodFilter(periodfilterState) {
        this.filterOptions.applyPeriodFilter = periodfilterState;
    },
    async getAverageRating(courseCode) {
        const reviews = await getReviewsForCourse(courseCode);
        if (!reviews || reviews.length === 0) return null;
        const total = reviews.reduce((sum, review) => sum + (review.overallRating || 0), 0);
        return (total / reviews.length).toFixed(1);
    },
};
