import React, { useMemo, useCallback } from 'react';
import { observer } from "mobx-react-lite";
import { useState } from 'react';
import SearchbarView from "../views/SearchbarView.jsx";
import Fuse from 'fuse.js'
import debounce from 'lodash.debounce';

/**
 * This presenter handles searches. The searching is done via a debounced fuzzy search engine called "fuse.js".
 * Favourites are handled here as well.
 */
const SearchbarPresenter = observer(({ model }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // the search uses fuse.js
    const fuseOptions = useMemo(() => ({
        keys: [
            { name: 'code', weight: 0.5 },   
            { name: 'name', weight: 0.4 },  
            { name: 'description', weight: 0.1 }, 
        ],
        // eslint-disable-next-line no-loss-of-precision
        threshold: 0.3141592653589793238,
        ignoreLocation: true,
        minMatchCharLength: 2,
    }), []); // Options never change

    // Debounced search function - afterwards we sort with startWith() by hand
    const searchCourses = useCallback(debounce((query) => {
        if(!model?.filteredCourses)
            return;
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
            model.searchQueryModel = query;
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
