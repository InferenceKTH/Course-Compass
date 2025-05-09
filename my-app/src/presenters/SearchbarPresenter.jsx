import React, { useEffect, useCallback } from 'react';
import { observer } from "mobx-react-lite";
import { useState } from 'react';
import CoursePagePopup from '../views/Components/CoursePagePopup.jsx';
import PrerequisitePresenter from './PrerequisitePresenter.jsx';
import { ReviewPresenter } from "./ReviewPresenter.jsx";
import SearchbarView from "../views/SearchbarView.jsx";
import Fuse from 'fuse.js'
import debounce from 'lodash.debounce';

const SearchbarPresenter = observer(({ model }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const fuseOptions = {
        keys: [
            { name: 'code', weight: 0.6 },   
            { name: 'name', weight: 0.3 },  
            { name: 'description', weight: 0.1 }, 
        ],
        threshold: 0.4,           // adjust this for sensitivity
        ignoreLocation: true,
        minMatchCharLength: 2,
    };

    // Debounced search function
    const searchCourses = useCallback(debounce((query) => {
        if (!query.trim()) {
            model.setCurrentSearch(model.filteredCourses);
        } else {
            const fuse = new Fuse(model.filteredCourses, fuseOptions);
            const results = fuse.search(query);
            
            const sortedResults = results.sort((a, b) => {
                const aStartsWith = a.item.code.toLowerCase().startsWith(query.toLowerCase());
                const bStartsWith = b.item.code.toLowerCase().startsWith(query.toLowerCase());
                
                //sort by prefix match as a primary sorting 
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.score - b.score;  //Fuse.js score sorting otherwise
            });

            model.setCurrentSearch(sortedResults.map(r => r.item));
        }
    }, 500), []);

    const addFavourite = (course) => {
        model.addFavourite(course);
    };

    const removeFavourite = (course) => {
        model.removeFavourite(course);
    };

    const handleFavouriteClick = (course) => {
        if (model.favourites.some(fav => fav.code === course.code)) {
            model.removeFavourite(course);
        } else {
            model.addFavourite(course);
        }
    };

    function resetScoll(){
        model.setScrollPosition(0.01);
    }

    const creditsSum = (favouriteCourses) => {
        return favouriteCourses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    };

    function removeAllFavourites() {
        model.setFavourite([]);
    }

    const preP = <PrerequisitePresenter 
        model={model}
        selectedCourse={model.selectedCourse}
    />;
    const reviewPresenter = <ReviewPresenter 
        model={model} 
        course={model.selectedCourse} 
    />;

    //Popup is displayed only in the list view now, to change the displayed course use model.setSelectedCourse(course)
    // const popup = <CoursePagePopup
    //     favouriteCourses={model.favourites}
    //     addFavourite={addFavourite}
    //     removeFavourite={removeFavourite}
    //     handleFavouriteClick={handleFavouriteClick}
    //     isOpen={model.isPopupOpen}
    //     onClose={() => model.setPopupOpen(false)}
    //     course={model.selectedCourse}
    //     reviewPresenter={reviewPresenter}
    //     prerequisiteTree={preP}
    // />;

    if(model.filtersCalculated){
        searchCourses(searchQuery);
        model.filtersCalculated = false;
    }

    return (
        <SearchbarView
            searchCourses={searchCourses}
            favouriteCourses={model.favourites}
            removeAllFavourites={removeAllFavourites}
            addFavourite={addFavourite}
            removeFavourite={removeFavourite}
            isPopupOpen={model.isPopupOpen}
            setIsPopupOpen={(isOpen) => model.setPopupOpen(isOpen)}
            setSelectedCourse={(course) => model.setSelectedCourse(course)}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            handleFavouriteClick={handleFavouriteClick}
            totalCredits={creditsSum(model.favourites)}
            resetScrollPosition={resetScoll}
        />
    );
});

export { SearchbarPresenter };
