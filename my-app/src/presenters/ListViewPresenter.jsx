import React from 'react';
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from 'react';
import ListView from "../views/ListView.jsx";
import CoursePagePopup from '../views/Components/CoursePagePopup.jsx';
import PrerequisitePresenter from './PrerequisitePresenter.jsx';
import {ReviewPresenter} from "../presenters/ReviewPresenter.jsx"
import {syncScrollPositionToFirebase} from "../../firebase.js"

const ListViewPresenter = observer(({ model }) => {
    const scrollContainerRef = useRef(null);
    let attempts = 0;
    const MAX_Depth = 49;

    function persistantScrolling(fetchMoreCourses, hasMore){
        const container = scrollContainerRef.current;
        if (!container || !model.scrollPosition) return;



        const attemptScroll = () => {

            // refresh on significant change (same as in firebase)
            if (Math.abs(container.scrollTop - model.scrollPosition) < 100)
                return;

            attempts++;
            if (attempts > MAX_Depth) {
                return;
            }
            const needsMoreCourses = container.scrollHeight < model.scrollPosition && hasMore;

            if (needsMoreCourses) {
                fetchMoreCourses();
                setTimeout(attemptScroll, 100); // Add delay between attempts
            } else {
                container.scrollTop = model.scrollPosition;
                syncScrollPositionToFirebase(model, scrollContainerRef)
            }
        };
        attemptScroll();
    }

    useEffect(() => {
        // Load initial scroll position
        const savedPosition = model.user
            ? model.scrollPosition
            : localStorage.getItem("scrollPosition");
        if (savedPosition) {
            model.setScrollPosition(parseInt(savedPosition, 10));
        }
    }, [model.user]);

    useEffect(() => {
        const cleanup = syncScrollPositionToFirebase(model, scrollContainerRef);
        return () => cleanup;
    }, [model.user, model.currentSearch, scrollContainerRef]);

    const addFavourite = (course) => {
        model.addFavourite(course);
    }
    const removeFavourite = (course) => {
        model.removeFavourite(course);
    }
    const handleFavouriteClick = (course) => {
        if (model.favourites.some(fav => fav.code === course.code)) {
            model.removeFavourite(course);
        } else {
            model.addFavourite(course);
        }
    };

    const setTargetScroll = (position) =>{
        model.setScrollPosition(position);
    }

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sortBy, setSortBy] = useState('relevance');
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortedCourses, setSortedCourses] = useState([]);

    const sortCourses = (courses, sortType) => {
        if (!courses) return [];
        
        const sortedCourses = [...courses];
        const direction = sortDirection === 'asc' ? 1 : -1;

        switch (sortType) {
            case 'name':
                return sortedCourses.sort((a, b) => 
                    direction * a.name.localeCompare(b.name));
            case 'credits':
                return sortedCourses.sort((a, b) => 
                    direction * (parseFloat(a.credits) - parseFloat(b.credits)));
            case 'relevance':
            default:
                return direction === 1 ? sortedCourses : sortedCourses.reverse();
        }
    };

    useEffect(() => {
        const sorted = sortCourses(model.currentSearch, sortBy);
        setSortedCourses(sorted);
    }, [model.currentSearch, sortBy, sortDirection]);

    const preP = <PrerequisitePresenter
        model={model}
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        setSelectedCourse={setSelectedCourse}
        selectedCourse={selectedCourse} />;
    const reviewPresenter = <ReviewPresenter model={model} course={selectedCourse} />;

    const popup = <CoursePagePopup
        favouriteCourses={model.favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
        handleFavouriteClick={handleFavouriteClick}
        isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}
        course={selectedCourse}
        prerequisiteTree={preP}
        reviewPresenter={reviewPresenter}/>




    return <ListView
        // courses={model.courses}
        // searchResults={model.currentSearch}
        // currentSearchLenght={model.currentSearch.length}

        favouriteCourses={model.favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
        handleFavouriteClick={handleFavouriteClick}

        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        setSelectedCourse={setSelectedCourse}
        popup={popup}

        targetScroll={model.scrollPosition}
        setTargetScroll={setTargetScroll}
        scrollContainerRef={scrollContainerRef}
        persistantScrolling={persistantScrolling}

        sortedCourses={sortedCourses}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        currentSearchLenght={sortedCourses.length}
    />;
});

export { ListViewPresenter };