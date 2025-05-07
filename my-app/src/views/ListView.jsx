import React, { useState, useEffect, useCallback } from 'react';
import { DotPulse, Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';
import InfiniteScroll from 'react-infinite-scroll-component';

function ListView(props) {
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [readMore, setReadMore] = useState({});
    const [isLoading, setIsLoading] = useState(true);
   
    const toggleReadMore = (courseCode) => {
        setReadMore(prevState => ({
            ...prevState,
            [courseCode]: !prevState[courseCode]
        }));
    };

    const handleFavouriteClick = (course) => {
        if (props.favouriteCourses.some(fav => fav.code === course.code)) {
            props.removeFavourite(course);
        } else {
            props.addFavourite(course);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const initialCourses = props.sortedCourses.slice(0, 10);
        setDisplayedCourses(initialCourses);
        setHasMore(props.sortedCourses.length > 10);
        setIsLoading(false);
    }, [props.sortedCourses]);

    const fetchMoreCourses = useCallback(() => {
        if (!hasMore) return;
        
        const nextItems = props.sortedCourses.slice(
            displayedCourses.length, 
            displayedCourses.length + 50
        );
        
        if (nextItems.length > 0) {
            setDisplayedCourses(prev => [...prev, ...nextItems]);
            setHasMore(displayedCourses.length + nextItems.length < props.sortedCourses.length);
        } else {
            setHasMore(false);
        }
    }, [displayedCourses.length, props.sortedCourses, hasMore]);

    const [isRestoringScroll, setIsRestoringScroll] = useState(false);
    useEffect(() => {
        if (props.targetScroll > 0 && !isRestoringScroll) {
            setIsRestoringScroll(true);
            props.persistantScrolling(fetchMoreCourses, hasMore);
            setIsRestoringScroll(false);
        }
    }, [props.targetScroll, hasMore, displayedCourses.length]);
   
    useEffect(() => {
    if (props.targetScroll === 0 && props.scrollContainerRef?.current) {
        props.scrollContainerRef.current.scrollTop = 0;
    }
}, [props.targetScroll]);

    if (!props.sortedCourses) {
        return (
            <div className="relative bg-white text-black p-2 flex flex-col gap-5 h-screen">
                <div className="text-white p-4 text-center">
                    ⚠️ No course data available.
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white text-black p-2 flex flex-col gap-3 h-screen">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Quantum size="400" speed="10" color="#000061" />
                </div>
            ) : (
                <div className="overflow-y-auto h-full" id="scrollableDiv" ref={props.scrollContainerRef}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-base font-semibold text-gray-600">
                            Found
                            <span className="font-bold text-[#000061] mx-1">
                                {props.currentSearchLenght}
                            </span>
                            courses
                        </p>
                        
                        <div className="flex items-center gap-2">
                            <select
                                value={props.sortBy}
                                onChange={(e) => props.setSortBy(e.target.value)}
                                className="bg-white border-2 border-[#000061] text-[#000061] font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                            >
                                <option value="relevance">Sort by Relevance</option>
                                <option value="name">Sort by Name</option>
                                <option value="credits">Sort by Credits</option>
                            </select>

                            <button
                                onClick={() => props.setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="bg-white border-2 border-[#000061] text-[#000061] font-semibold p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                                aria-label={`Sort ${props.sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                            >
                                {props.sortDirection === 'asc' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <InfiniteScroll
                        dataLength={displayedCourses.length}
                        next={fetchMoreCourses}
                        hasMore={hasMore}
                        loader={
                            <div className="text-center py-3">
                                <DotPulse size="100" speed="1.3" color="black" />
                            </div>
                        }
                        endMessage={<p className="text-center py-2">No more courses</p>}
                        scrollThreshold={0.9}
                        scrollableTarget="scrollableDiv"
                        initialScrollY={0}
                    >
                        {displayedCourses.map(course => (
                            <div
                                onClick={() => {
                                    props.setSelectedCourse(course);
                                    props.setIsPopupOpen(true);
                                }}
                                key={course.code}
                                className="p-5 mb-3 hover:bg-blue-100 flex items-center border border-b-black border-solid w-full rounded-lg cursor-pointer"
                            >
                                <div>
                                    <p className="font-bold text-[#000061]">{course.code}</p>
                                    <p className="font-bold">{course.name}</p>
                                    <p
                                        className="text-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: readMore[course.code]
                                                ? course?.description
                                                : (course?.description?.slice(0, 200)+"..."),
                                        }}
                                    />
                                    {course?.description?.length > 150 && (
                                        <span
                                            className="text-blue-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleReadMore(course.code);
                                            }}
                                        >
                                            {readMore[course.code] ? ' show less' : ' read more'}
                                        </span>
                                    )}
                                    <div>
                                        {/* <button
                                            className="text-yellow-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavouriteClick(course);
                                            }}
                                        >
                                            {props.favouriteCourses.some(fav => fav.code === course.code)
                                                ? 'Unfavourite'
                                                : 'Favourite'}
                                        </button> */}
                                        {/* The new button seems to not mach the style  TODO: change the fav button*/}
                                        <button
                                            className={`inline-flex items-center mt-1.5 px-4 py-1 gap-2 rounded-lg
										   transition-all duration-300 ease-in-out
										   font-semibold text-sm shadow-sm
										   ${props.favouriteCourses.some((fav) => fav.code === course.code)
                                                    ? 'bg-yellow-400 /90 hover:bg-yellow-500/90 border-2 border-yellow-600 hover:border-yellow-700 text-yellow-900'
                                                    : 'bg-yellow-200/90 hover:bg-yellow-300 border-2 border-yellow-400 hover:border-yellow-500 text-yellow-600 hover:text-yellow-700'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFavouriteClick(course);
                                            }}
                                        >
                                            {props.favouriteCourses.some((fav) => fav.code === course.code) ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-yellow-900" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Remove from Favourites
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    Add to Favourites
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            )}
            {props.popup}
            {!isLoading && props.targetScroll > 1000 &&(
            <button
                onClick={() => props.setTargetScroll(0)}
                className="fixed bottom-6 right-6 z-50 bg-[#000061] text-white p-3 rounded-full shadow-lg hover:bg-[#1a1a80] transition-all"
                title="Scroll to top"
            >
                ↑
            </button>
            )}

        </div>
   );
}

export default ListView;