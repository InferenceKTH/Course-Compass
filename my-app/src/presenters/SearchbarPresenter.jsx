import React, { useEffect, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import CoursePagePopup from '../views/Components/CoursePagePopup.jsx';
import PrerequisitePresenter from './PrerequisitePresenter.jsx';
import { ReviewPresenter } from '../presenters/ReviewPresenter.jsx';
import SearchbarView from '../views/SearchbarView.jsx';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';

const SearchbarPresenter = observer(({ model }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
        if (themeMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [themeMode]);

    const fuseOptions = {
        keys: [
            { name: 'code', weight: 0.6 },
            { name: 'name', weight: 0.3 },
            { name: 'description', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
    };

    const searchCourses = useCallback(
        debounce((query) => {
            if (!query.trim()) {
                model.setCurrentSearch(model.filteredCourses);
            } else {
                const fuse = new Fuse(model.filteredCourses, fuseOptions);
                const results = fuse.search(query).map((r) => r.item);
                model.setCurrentSearch(results);
            }
        }, 500),
        []
    );

    const handleFavouriteClick = (course) => {
        if (model.favourites.some((fav) => fav.code === course.code)) {
            model.removeFavourite(course);
        } else {
            model.addFavourite(course);
        }
    };

    const resetScroll = () => {
        model.setScrollPosition(0.01);
    };

    const creditsSum = (favouriteCourses) => {
        return favouriteCourses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    };

    const removeAllFavourites = () => {
        model.setFavourite([]);
    };

    const toggleThemeMode = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const preP = <PrerequisitePresenter model={model} selectedCourse={selectedCourse} />;
    const reviewPresenter = <ReviewPresenter model={model} course={selectedCourse} />;

    const popup = (
        <CoursePagePopup
            favouriteCourses={model.favourites}
            handleFavouriteClick={handleFavouriteClick}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            course={selectedCourse}
            reviewPresenter={reviewPresenter}
            prerequisiteTree={preP}
            themeMode={themeMode}
        />
    );

    if (model.filtersCalculated) {
        searchCourses(searchQuery);
        model.filtersCalculated = false;
    }

    return (
        <SearchbarView
            searchCourses={searchCourses}
            favouriteCourses={model.favourites}
            removeAllFavourites={removeAllFavourites}
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
            setSelectedCourse={setSelectedCourse}
            popup={popup}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            handleFavouriteClick={handleFavouriteClick}
            totalCredits={creditsSum(model.favourites)}
            resetScrollPosition={resetScroll}
            themeMode={themeMode}
            toggleThemeMode={toggleThemeMode}
        />
    );
});

export { SearchbarPresenter };