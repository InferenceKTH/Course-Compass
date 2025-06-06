import React from "react";
import { observer } from "mobx-react-lite";
import { useState, useEffect, useRef, useMemo } from "react";
import ListView from "../views/ListView.jsx";
import CoursePagePopup from "../views/Components/CoursePagePopup.jsx";
import PrerequisitePresenter from "./PrerequisitePresenter.jsx";
import { ReviewPresenter } from "./ReviewPresenter.jsx";
import { syncScrollPositionToFirebase } from "../../firebase.js";
import { useCallback } from "react";

/**
 * This Presenter handles the ListView, aka. the display of courses for a given filter / search.
 * Also the scrolling (and restoring scroll) logic is located here.
 */
const ListViewPresenter = observer(({ model }) => {
	const scrollContainerRef = useRef(null);
	let attempts = 0;
	const MAX_Depth = 49;

	/**
	 * Tries to scroll to a
	 * @param {*} fetchMoreCourses
	 * @param {*} hasMore
	 * @returns
	 */
	function persistantScrolling(fetchMoreCourses, hasMore) {
		const container = scrollContainerRef.current;
		if (!container || !model.scrollPosition) return;

		const attemptScroll = () => {
			// refresh on significant change (same as in firebase)
			if (Math.abs(container.scrollTop - model.scrollPosition) < 100) return;

			attempts++;
			if (attempts > MAX_Depth) {
				return;
			}
			const needsMoreCourses =
				container.scrollHeight < model.scrollPosition && hasMore;

			if (needsMoreCourses) {
				fetchMoreCourses();
				setTimeout(attemptScroll, 100); // Add delay between attempts
			} else {
				container.scrollTop = model.scrollPosition;
				syncScrollPositionToFirebase(model, scrollContainerRef);
			}
		};
		attemptScroll();
	}

	/**
	 * Loads the last saved scroll position from localStorage on reload or user change
	 */
	useEffect(() => {
		// Load initial scroll position
		const savedPosition = model.user
			? model.scrollPosition
			: localStorage.getItem("scrollPosition");
		if (savedPosition) {
			model.setScrollPosition(parseInt(savedPosition, 10));
		}
	}, [model, model.user]);

	/**
	 * On scrolling syncs with Firebase. Currently the subfunction is 
     * disabled and synching is done to local storage instead.
	 */
	useEffect(() => {
		const cleanup = syncScrollPositionToFirebase(model, scrollContainerRef);
		return () => cleanup;
	}, [model, model.user, model.currentSearch, scrollContainerRef]);

	// in the following there are setters to be passed to subviews.
	const addFavourite = (course) => {
		model.addFavourite(course);
	};
	const removeFavourite = (course) => {
		model.removeFavourite(course);
	};
	const handleFavouriteClick = (course) => {
		if (model.favourites.some((fav) => fav.code === course.code)) {
			model.removeFavourite(course);
		} else {
			model.addFavourite(course);
		}
	};

	const setTargetScroll = (position) => {
		model.setScrollPosition(position);
	};

	const [sortBy, setSortBy] = useState("relevance");
	const [sortDirection, setSortDirection] = useState("desc");

	const sortCourses = useCallback(
		(courses, sortType) => {
			if (!courses) return [];

			const sortedCourses = [...courses];
			const direction = sortDirection === "asc" ? 1 : -1;

			switch (sortType) {
				case "name":
					return sortedCourses.sort(
						(a, b) => direction * a.name.localeCompare(b.name)
					);
				case "credits":
					return sortedCourses.sort(
						(a, b) =>
							direction * (parseFloat(a.credits) - parseFloat(b.credits))
					);

				// indexes: 0 -> overall rating; 1 -> difficulty; 2->teacher rating
				case "avg_rating":
					return sortedCourses.sort((a, b) => {
						let aScore = 0;
						let bScore = 0;

						if (
							model.avgRatings[a.code] != null &&
							model.avgRatings[a.code][0] != null
						) {
							aScore = model.avgRatings[a.code][0] + 10; // +10 so courses with no reviews are shown before those with bad reviews (0/5 stars)
						}

						if (
							model.avgRatings[b.code] != null &&
							model.avgRatings[b.code][0] != null
						) {
							bScore = model.avgRatings[b.code][0] + 10;
						}
						return direction * (aScore - bScore);
					});
				case "diff_rating":
					return sortedCourses.sort((a, b) => {
						let aScore = 0;
						let bScore = 0;

						if (
							model.avgRatings[a.code] != null &&
							model.avgRatings[a.code][1] != null
						) {
							aScore = model.avgRatings[a.code][1] + 10; // +10 so courses with no reviews are shown before those with bad reviews (0/5 stars)
						}

						if (
							model.avgRatings[b.code] != null &&
							model.avgRatings[b.code][1] != null
						) {
							bScore = model.avgRatings[b.code][1] + 10;
						}

						return direction * (aScore - bScore);
					});
				case "teacher_rating":
					return sortedCourses.sort((a, b) => {
						let aScore = 0;
						let bScore = 0;

						if (
							model.avgRatings[a.code] != null &&
							model.avgRatings[a.code][2] != null
						) {
							aScore = model.avgRatings[a.code][2] + 10; // +10 so courses with no reviews are shown before those with bad reviews (0/5 stars)
						}

						if (
							model.avgRatings[b.code] != null &&
							model.avgRatings[b.code][2] != null
						) {
							bScore = model.avgRatings[b.code][2] + 10;
						}
						return direction * (aScore - bScore);
					});
				case "relevance":
					return direction === -1 ? sortedCourses : sortedCourses.reverse();
				default:
					return direction === 1 ? sortedCourses : sortedCourses.reverse();
			}
		},
		[sortDirection, model.avgRatings]
	);

	const sortedCourses = useMemo(() => {
		if (!model.currentSearch) return [];
		return sortCourses(model.currentSearch, sortBy);
	}, [model.currentSearch, sortBy, sortCourses]);

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

	window.addEventListener("popstate", () => {
		model.handleUrlChange();
	});
	// eslint-disable-next-line no-unused-vars
	model.onCoursesSet((courses) => { 
		let current_url = window.location.href;
		if (current_url.indexOf("#") != -1) {
			return;
		}
		let course_code = "";
		let start_index = indexOfNth(current_url, "/", 3) + 2;
		if (start_index > 1) {
			course_code = current_url.slice(start_index);
		}
		if (start_index != current_url.length && course_code.length >= 6) {
			window.history.replaceState({}, "", "/");
			window.history.pushState({}, "", "/?" + course_code);
		}
		model.handleUrlChange();
	});

	// here the passed presenters for subelements are created and passed
	const preP = (
		<PrerequisitePresenter
			model={model}
			isPopupOpen={model.isPopupOpen}
			setIsPopupOpen={(isOpen) => model.setPopupOpen(isOpen)}
			setSelectedCourse={(course) => model.setSelectedCourse(course)}
			selectedCourse={model.selectedCourse}
		/>
	);
	const reviewPresenter = (
		<ReviewPresenter model={model} course={model.selectedCourse} />
	);

	const popup = (
		<CoursePagePopup
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
		/>
	);

	return (
		<ListView
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
		/>
	);
});

export { ListViewPresenter };
