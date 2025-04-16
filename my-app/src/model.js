import { addCourse, addReviewForCourse, getReviewsForCourse } from "../firebase";


export const model = {
    user: undefined,
    //add searchChange: false,   //this is for reworking the searchbar presenter, so that it triggers as a model, 
    //instead of passing searchcouses lambda function down into the searchbarview.
    currentSearch: [],
    currentSearchText: "",
    scrollPosition: 0,
    courses: [],
    favourites: [],
    isReady: false,
    filtersChange: false,
    filtersCalculated: false,
    filteredCourses: [],
    filterOptions: {
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
        applyRemoveNullCourses: false
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

    populateDatabase(data) {
        if (!data || !this) {
            console.log("no model or data");
            return;
        }
        const entries = Object.entries(data);
        entries.forEach(entry => {
            const course = {
                code: entry[1].code,
                name: entry[1]?.name ?? "null",
                location: entry[1]?.location ?? "null",
                department: entry[1]?.department ?? "null",
                language: entry[1]?.language ?? "null",
                description: entry[1]?.description ?? "null",
                academicLevel: entry[1]?.academic_level ?? "null",
                period: entry[1]?.period ?? "null",
                credits: entry[1]?.credits ?? 0,
                prerequisites: entry[1]?.prerequisites ?? "null",
                prerequisites_text: entry[1]?.prerequisites_text ?? "null",
                learning_outcomes: entry[1]?.learning_outcomes ?? "null"
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
    
    updateLevelFilter(level) {
        this.filterOptions.level = level;
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
        console.log(department);
        this.filterOptions.department = department;
    },

    //setters for the filter options
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

    async getAverageRating(courseCode) {
        const reviews = await getReviewsForCourse(courseCode);
        if (!reviews || reviews.length === 0) return null;
        const total = reviews.reduce((sum, review) => sum + (review.overallRating || 0), 0);
        return (total / reviews.length).toFixed(1);
    },


};
