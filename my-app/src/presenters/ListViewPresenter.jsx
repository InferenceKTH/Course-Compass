import React from 'react';
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef } from 'react';
import ListView from "../views/ListView.jsx";
import CoursePagePopup from '../views/Components/CoursePagePopup.jsx';
import PrerequisitePresenter from './PrerequisitePresenter.jsx';
import {ReviewPresenter} from "./ReviewPresenter.jsx"
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

    const [sortBy, setSortBy] = useState('relevance');
    const [sortDirection, setSortDirection] = useState('desc');
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
                return direction === -1 ? sortedCourses : sortedCourses.reverse();
            default:
                return direction === 1 ? sortedCourses : sortedCourses.reverse();
        }
    };

    useEffect(() => {
        const sorted = sortCourses(model.currentSearch, sortBy);
        setSortedCourses(sorted);
    }, [model.currentSearch, sortBy, sortDirection]);

    
    function indexOfNth(string, char, n) {
        let count = 0;
        for (let i = 0; i < string.length; i++) {
            if (string[i] == char) {
                count++;
            }
            if (count == n) {
                return i;
            }
        }
        return -1;
    }

    window.addEventListener('popstate', () => {
        model.handleUrlChange();
    });

    model.onCoursesSet((courses) => {
        let current_url = window.location.href;
        let course_code = "";
        let start_index = indexOfNth(current_url, '/', 3) + 1;
        if (start_index > 1) {
            course_code = current_url.slice(start_index);
        }
        if (start_index != current_url.length && course_code.length >= 6) {
            window.history.replaceState({}, '', '/');
            window.history.pushState({}, '', '/' + course_code);
        }
        model.handleUrlChange();
    })

    const preP = <PrerequisitePresenter
        model={model}
        isPopupOpen={model.isPopupOpen}
        setIsPopupOpen={(isOpen) => model.setPopupOpen(isOpen)}
        setSelectedCourse={(course) => model.setSelectedCourse(course)}
        selectedCourse={model.selectedCourse} />;
    const reviewPresenter = <ReviewPresenter model={model} course={model.selectedCourse} />;

    const popup = <CoursePagePopup
        favouriteCourses={model.favourites}
        addHistoryItem={model.addHistoryItem}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
        handleFavouriteClick={handleFavouriteClick}
        isOpen={model.isPopupOpen}
        onClose={() => model.setPopupOpen(false)}
        course={model.selectedCourse}
        prerequisiteTree={preP}
        reviewPresenter={reviewPresenter}
        sidebarIsOpen={model.sidebarIsOpen}
    />;

    return <ListView
        favouriteCourses={model.favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
        handleFavouriteClick={handleFavouriteClick}

        isPopupOpen={model.isPopupOpen}
        setPopupOpen={(isOpen) => model.setPopupOpen(isOpen)}
        setSelectedCourse={(course) => model.setSelectedCourse(course)}
        popup={popup}
        query={model.searchQueryModel}
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