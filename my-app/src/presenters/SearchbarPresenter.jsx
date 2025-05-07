import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import { useState } from 'react';
import CoursePagePopup from '../views/Components/CoursePagePopup.jsx';
import PrerequisitePresenter from './PrerequisitePresenter.jsx';
import { ReviewPresenter } from "../presenters/ReviewPresenter.jsx";
import SearchbarView from "../views/SearchbarView.jsx";

const SearchbarPresenter = observer(({ model }) => {

    const searchCourses = (query) => {
        //model.filteredCourses is essentially a smaller subset of model.courses, if theres no filters, it should be the same
        console.log("---------------search recalculated");
        console.log("filtered courses length: ", model.filteredCourses.length);
        const searchResults = model.filteredCourses.filter(course =>
            course.code.toLowerCase().includes(query.toLowerCase()) ||
            course.name.toLowerCase().includes(query.toLowerCase()) ||
            course.description.toLowerCase().includes(query.toLowerCase())
        );
        model.setCurrentSearchText(query);
        model.setCurrentSearch(searchResults);
        console.log(model.currentSearch.length);
    };

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

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const preP = <PrerequisitePresenter model={model} selectedCourse={selectedCourse} />;
    const reviewPresenter = <ReviewPresenter model={model} course={selectedCourse} />;

    const popup = <CoursePagePopup
        favouriteCourses={model.favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
        handleFavouriteClick={handleFavouriteClick}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        course={selectedCourse}
        reviewPresenter={reviewPresenter}
        prerequisiteTree={preP}
    />;
    

    if(model.filtersCalculated){
        searchCourses("");
        model.filtersCalculated = false;
    }

    return (
        <SearchbarView
            searchCourses={searchCourses}
            favouriteCourses={model.favourites}
            removeAllFavourites={removeAllFavourites}
            addFavourite={addFavourite}
            removeFavourite={removeFavourite}
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
            setSelectedCourse={setSelectedCourse}
            popup={popup}
            handleFavouriteClick={handleFavouriteClick}
            totalCredits={creditsSum(model.favourites)}
            resetScrollPosition={resetScoll}
        />
    );
});

export { SearchbarPresenter };
