
import React, { useState, useEffect, useCallback } from 'react';
import { DotPulse, Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { model } from "../model";
import RatingDisplay from "./Components/RatingDisplay.jsx";

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
        async function loadInitialCoursesWithRatings() {
            setIsLoading(true);
            const initialCourses = props.sortedCourses.slice(0, 10);

            const coursesWithRatings = await Promise.all(
                initialCourses.map(async (course) => {
                    const avg = await model.getAverageRating(course.code);
                    return { ...course, avgRating: parseFloat(avg) || 0 };
                })
            );

            setDisplayedCourses(coursesWithRatings);
            setHasMore(props.sortedCourses.length > 10);
            setIsLoading(false);
        }

        loadInitialCoursesWithRatings();
    }, [props.sortedCourses]);

    const fetchMoreCourses = useCallback(async () => {
        if (!hasMore) return;

        const nextItems = props.sortedCourses.slice(
            displayedCourses.length,
            displayedCourses.length + 50
        );

        if (nextItems.length > 0) {
            const nextWithRatings = await Promise.all(
                nextItems.map(async (course) => {
                    const avg = await model.getAverageRating(course.code);
                    return { ...course, avgRating: parseFloat(avg) || 0 };
                })
            );

            setDisplayedCourses(prev => [...prev, ...nextWithRatings]);
            setHasMore(displayedCourses.length + nextWithRatings.length < props.sortedCourses.length);
        } else {
            setHasMore(false);
        }
    }, [displayedCourses.length, props.sortedCourses, hasMore]);

    useEffect(() => {
        if (props.targetScroll > 0) {
            props.persistantScrolling(fetchMoreCourses, hasMore);
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
                                aria-label="Toggle sort direction"
                            >
                                {props.sortDirection === 'desc' ? "↓" : "↑"}
                            </button>
                        </div>
                    </div>

                    <InfiniteScroll
                        dataLength={displayedCourses.length}
                        next={fetchMoreCourses}
                        hasMore={hasMore}
                        loader={<div className="text-center py-3"><DotPulse size="100" speed="1.3" color="black" /></div>}
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
                                    <RatingDisplay rating={course.avgRating} />
                                    <p
                                        className="text-gray-600"
                                        dangerouslySetInnerHTML={{
                                            __html: readMore[course.code]
                                                ? course?.description
                                                : (course?.description?.slice(0, 200) + "...")
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
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
            )}
            {props.popup}
            {!isLoading && props.targetScroll > 1000 && (
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
