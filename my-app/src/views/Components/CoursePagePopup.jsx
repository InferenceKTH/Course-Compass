import React, { useEffect, useRef, useState } from 'react';
import RatingComponent from "./RatingComponent.jsx";
import { model } from "../../model.js";

function CoursePagePopup({
							 favouriteCourses,
							 handleFavouriteClick,
							 isOpen,
							 onClose,
							 course,
							 prerequisiteTree,
							 reviewPresenter,
							 themeMode
						 }) {
	const treeRef = useRef(null);
	const [showOverlay, setShowOverlay] = useState(false);
	const [averageRating, setAverageRating] = useState(null);

	const themeStyles = {
		light: {
			background: 'bg-gray-100/90',
			text: 'text-[#2e2e4f]',
			secondaryText: 'text-slate-900',
			accentText: 'text-violet-700',
			accentHover: 'hover:text-violet-600',
			underline: 'bg-violet-500',
			closeButton: 'bg-violet-500',
			tree: 'bg-indigo-300/50',
			treeOverlay: 'bg-indigo-200/10',
			favouriteButton: 'bg-violet-500 hover:bg-violet-600 border-2 border-violet-600 hover:border-violet-700',
			favouriteButtonActive: 'bg-violet-600 hover:bg-violet-700 border-2 border-violet-700 hover:border-violet-800',
		},

	};


	useEffect(() => {
		const fetchAverageRating = async () => {
			try {
				const avg = await model.getAverageRating(course.code);
				setAverageRating(avg);
			} catch (error) {
				setAverageRating(null);
			}
		};

		if (isOpen && course) fetchAverageRating();
	}, [isOpen, course]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	const handleTreeClick = () => {
		if (treeRef.current) {
			treeRef.current.focus();
		}
	};

	if (!isOpen || !course) return null;

	return (
		<div className="fixed backdrop-blur-sm inset-0 bg-transparent flex justify-end z-50">
			<div
				className={`${themeStyles[themeMode].background} backdrop-blur-lg h-full w-full flex flex-col overflow-auto transition-colors duration-300`}
				onClick={(e) => {
					e.stopPropagation();
					setShowOverlay(true);
				}}
			>
				<div className="flex-1">
					<div className={`px-10 py-10 md:px-20 md:py-16 ${themeStyles[themeMode].secondaryText} space-y-12 font-sans`}>
						{/* Course Title Section */}
						<div>
							<h2 className={`text-5xl font-bold ${themeStyles[themeMode].text}`}>
								<a
									href={`https://www.kth.se/student/kurser/kurs/${course.code}`}
									target="_blank"
									rel="noopener noreferrer"
									className={`${themeStyles[themeMode].accentHover} transition-colors duration-300 ${themeStyles[themeMode].accentText}`}
								>
									<span className={`${themeStyles[themeMode].accentText}`}>{course.code}</span>
									{' '}- {' '}
									{course.name}
								</a>
								<button
									onClick={onClose}
									className={`absolute top-3 right-3 ${themeStyles[themeMode].accentText} hover:text-violet-900`}
								>
									X
								</button>
								<span className={`ml-4 text-lg ${themeStyles[themeMode].accentText} whitespace-nowrap`}>
                  ({course.credits} Credits)
                </span>
							</h2>
							<div className={`my-6 h-1.5 w-full ${themeStyles[themeMode].underline}`}></div>
						</div>
						<div className="flex justify-between items-center">
							<button
								className={`inline-flex items-center px-4 py-2 gap-2 rounded-lg
                  transition-all duration-300 ease-in-out
                  font-semibold text-sm shadow-sm
                  ${favouriteCourses.some((fav) => fav.code === course.code)
									? themeStyles[themeMode].favouriteButtonActive
									: themeStyles[themeMode].favouriteButton
								} text-white`}
								onClick={(e) => {
									e.stopPropagation();
									handleFavouriteClick(course);
								}}
							>
								{favouriteCourses.some((fav) => fav.code === course.code) ? (
									<>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 fill-white"
											viewBox="0 0 20 20"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
										Remove from Favourites
									</>
								) : (
									<>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 stroke-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
											/>
										</svg>
										Add to Favourites
									</>
								)}
							</button>
							<div className="flex flex-col items-center">
								{averageRating !== null ? (
									<p className={`text-lg font-semibold ${themeStyles[themeMode].accentText}`}>
										Average Rating: {averageRating} / 5
									</p>
								) : (
									<p className={`text-lg font-semibold ${themeStyles[themeMode].accentText}`}>
										No Reviews Yet
									</p>
								)}
								<RatingComponent readOnly={true} value={averageRating || 0} />
							</div>
						</div>
						{/* Description Section */}
						{course.description &&
							course.description.trim() &&
							course.description.trim() !== "null" && (
								<div>
									<h3 className={`text-2xl font-bold ${themeStyles[themeMode].text} mb-0.5`}>Course Description</h3>
									<div className={`mb-3 h-0.5 w-full ${themeStyles[themeMode].underline}`}></div>
									<div
										className={`text-lg leading-8 ${themeStyles[themeMode].text} font-semibold tracking-wide prose prose-slate max-w-full`}
										dangerouslySetInnerHTML={{ __html: course.description }}
									/>
								</div>
							)}
						{/* Learning outcomes */}
						<div>
							<h3 className={`text-2xl font-bold ${themeStyles[themeMode].text} mb-0.5`}>Learning Outcomes:</h3>
							<div className={`mb-3 h-0.5 w-full ${themeStyles[themeMode].underline}`}></div>
							{course.learning_outcomes && course.learning_outcomes.trim() &&
							course.description.trim() !== "null" ? (
								<div
									className={`text-lg leading-8 ${themeStyles[themeMode].text} font-semibold tracking-wide prose prose-slate max-w-full`}
									dangerouslySetInnerHTML={{ __html: course.learning_outcomes }}
								/>
							) : (
								<p className={`text-lg ${themeStyles[themeMode].text} font-semibold italic`}>
									No learning outcomes information available
								</p>
							)}
						</div>
						{/* Prerequisite Graph Tree Section */}
						<div>
							<h3 className={`text-2xl font-semibold ${themeStyles[themeMode].text} mb-0.5`}>Prerequisite Graph Tree</h3>
							<div className={`mb-4 h-0.5 w-full ${themeStyles[themeMode].underline} rounded-lg`}></div>
							<div className="relative rounded-lg">
								{showOverlay && (
									<div
										className={`absolute inset-0 z-10 ${themeStyles[themeMode].treeOverlay} rounded-lg cursor-pointer flex items-center justify-center z-51`}
										onClick={(e) => {
											e.stopPropagation();
											setShowOverlay(false);
										}}
									>
									</div>
								)}
								<div
									className={`${themeStyles[themeMode].tree} outline-none focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-lg transition-shadow`}
									ref={treeRef}
									onClick={handleTreeClick}
									tabIndex={0}
								>
									{prerequisiteTree}
								</div>
							</div>
						</div>
						{/* Prereq Section */}
						<div>
							<h3 className={`text-2xl font-bold ${themeStyles[themeMode].text} mb-0.5`}>Prerequisites:</h3>
							<div className={`mb-3 h-0.5 w-full ${themeStyles[themeMode].underline}`}></div>
							{course.prerequisites_text && course.prerequisites_text.trim() &&
							course.description.trim() !== "null" ? (
								<div
									className={`text-lg leading-8 ${themeStyles[themeMode].text} font-semibold tracking-wide prose prose-slate max-w-full`}
									dangerouslySetInnerHTML={{ __html: course.prerequisites_text }}
								/>
							) : (
								<p className={`text-lg ${themeStyles[themeMode].text} font-semibold italic`}>
									Prerequisites information not available
								</p>
							)}
						</div>
						{/* Reviews Section (optional) */}
						{reviewPresenter && (
							<div>
								<h3 className={`text-2xl font-semibold ${themeStyles[themeMode].text} mb-0.5`}>Reviews</h3>
								<div className={`mb-4 h-0.5 w-full ${themeStyles[themeMode].underline}`}></div>
								{reviewPresenter}
							</div>
						)}
					</div>
				</div>
				<button
					className={`px-4 py-2 ${themeStyles[themeMode].closeButton} text-white`}
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
}

export default CoursePagePopup;