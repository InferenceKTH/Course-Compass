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
	sidebarIsOpen
}) {

	const treeRef = useRef(null);
	const [showOverlay, setShowOverlay] = useState(true);
	const [averageRating, setAverageRating] = useState(null);
	const [professorRating, setProfessorRating] = useState(null);
	const [difficultyRating, setDifficultyRating] = useState(null);

	const handlePeriodsAndLanguages = (periods) => {
		let ret_string = "";
		if (periods) {
			let keys = Object.keys(periods);
			for (let key of keys) {
				if (periods[key]) {
					ret_string += key + ", ";
				}
			}
			return ret_string.slice(0, -2);
		} else {
			return;
		}
	};

	const formatText = (text) => {
		return text
			.replace(/\n\n/g, '<br/><br/>') // Double line breaks
			.replace(/•\s*/g, '<br/>• ') // Bullet points with proper spacing
			.replace(/(\d+\.)\s*/g, '<br/>$1 ') // Numbered lists with proper spacing
			.replace(/([.!?])\s+(?=[A-Z])/g, '$1<br/><br/>') // New line after sentences that end with capital letter
			.replace(/[:]\s*(?=[A-Z])/g, ':<br/>') // New line after colons followed by capital letter
			.split(/\n/).map(line => {
				// Check if line starts with bullet or number
				if (!/^[•\d]/.test(line.trim())) {
					return `<div className="mb-4">${line}</div>`;
				}
				return line;
			}).join('');
	};

	useEffect(() => {
		const fetchRatings = async () => {
			try {
				const avg = await model.getAverageRating(course.code, "avg");
				setAverageRating(avg);

			} catch (error) {
				setAverageRating(null);
			}
			try {
				const avg = await model.getAverageRating(course.code, "diff");
				setDifficultyRating(avg);

			} catch (error) {
				setDifficultyRating(null);
			}
			try {
				const avg = await model.getAverageRating(course.code, "prof");
				setProfessorRating(avg);

			} catch (error) {
				setProfessorRating(null);
			}
		};

		if (isOpen && course) fetchRatings();

	}, [isOpen, course]);


	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape' || event.key === 'ArrowLeft') {
				setShowOverlay(true);
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
		<div
			className={`fixed  backdrop-blur-lg inset-0  flex justify-center z-50 ${sidebarIsOpen ? 'pl-[400px]' : 'w-full'
				}`}
			onClick={onClose}
		>
			<div
				className="bg-indigo-300/75 backdrop-blur-lg h-full w-full flex flex-col overflow-auto"
				onClick={(e) => {
					e.stopPropagation();
					setShowOverlay(true);
				}}
			>
				<div className="flex-1">
					<div className="px-10 py-10 md:px-20 md:py-16 text-slate-900 space-y-8 font-sans">
						{/* Course Title Section */}
						<div>
							<h2 className="text-5xl font-extrabold text-[#2e2e4f]">
								<a
									href={`https://www.kth.se/student/kurser/kurs/${course.code}`}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-violet-600 transition-colors duration-300"
								>
									<span className="text-violet-700 ">{course.code}</span>
									{' '}- {' '}
									{course.name}

								</a>

								<button
									onClick={onClose}
									className="absolute top-4 right-4 p-2 rounded-full hover:bg-violet-200/50 transition-colors duration-200"
									aria-label="Close course details"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-violet-700 hover:text-violet-900"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>

								<span className="ml-4 text-lg text-violet-700 whitespace-nowrap">
									({course.credits} Credits)
								</span>
							</h2>
							<div className="my-6 h-1.5 w-full bg-violet-500"></div>
						</div>

						{/* Course Info Section */}
						<div className="flex flex-col space-y-4 bg-white/40 p-6 rounded-xl shadow-md">
							{/* Top Row - Basic Info */}
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col space-y-2">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-violet-800">Academic Level:</span>
										<span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
											{course.academicLevel || 'Not specified'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-violet-800">Department:</span>
										<span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
											{course.department || 'Not specified'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-violet-800">Language:</span>
										<span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
											{handlePeriodsAndLanguages(course?.language) || 'Languages not specified'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-violet-800">Course Periods:</span>
										<span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
											{handlePeriodsAndLanguages(course?.periods) || 'Periods not specified'}
										</span>
									</div>

								</div>

								<div className="flex flex-col space-y-4">
									<div className="flex flex-col space-y-4">
										<div className="flex flex-col bg-violet-50 p-4 rounded-lg space-y-4">
											<div className="flex flex-col">
												<span className="text-sm font-medium text-violet-800 mb-1">Overall Rating:</span>
												<div className="flex items-center gap-2">
													<RatingComponent readOnly={true} value={averageRating || 0} />
													<span className="text-sm font-medium text-violet-700">
														{averageRating !== null
															? `${Number(averageRating).toFixed(1)}/5.0`
															: '(No ratings yet)'}
													</span>
												</div>
											</div>

											<div className="flex flex-col">
												<span className="text-sm font-medium text-violet-800 mb-1">Professor Rating:</span>
												<div className="flex items-center gap-2">
													<RatingComponent readOnly={true} value={professorRating || 0} />
													<span className="text-sm font-medium text-violet-700">
														{professorRating !== null
															? `${Number(professorRating).toFixed(1)}/5.0`
															: '(No ratings yet)'}
													</span>
												</div>
											</div>

											<div className="flex flex-col">
												<span className="text-sm font-medium text-violet-800 mb-1">Difficulty:</span>
												<div className="flex items-center gap-2">
													<RatingComponent readOnly={true} value={difficultyRating || 0} />
													<span className="text-sm font-medium text-violet-700">
														{difficultyRating !== null
															? `${Number(difficultyRating).toFixed(1)}/5.0`
															: '(No ratings yet)'}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Bottom Row - Favorite Button */}
							<div className="border-t border-violet-200 pt-4">
								<button
									className={`inline-flex items-center px-4 py-2 gap-2 rounded-lg
                      transition-all duration-300 ease-in-out
                      font-semibold text-sm shadow-sm w-full justify-center
                      ${favouriteCourses.some((fav) => fav.code === course.code)
											? 'bg-yellow-400/90 hover:bg-yellow-500/90 border-2 border-yellow-600 hover:border-yellow-700 text-yellow-900'
											: 'bg-yellow-200/90 hover:bg-yellow-300 border-2 border-yellow-400 hover:border-yellow-500 text-yellow-600 hover:text-yellow-700'
										}`}
									onClick={(e) => {
										e.stopPropagation();
										handleFavouriteClick(course);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-5 w-5 ${favouriteCourses.some((fav) => fav.code === course.code) ? 'fill-yellow-900' : 'stroke-yellow-500'}`}
										fill={favouriteCourses.some((fav) => fav.code === course.code) ? 'currentColor' : 'none'}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
										/>
									</svg>
									<span>{favouriteCourses.some((fav) => fav.code === course.code) ? 'Remove from Favourites' : 'Add to Favourites'}</span>
								</button>
							</div>
						</div>

						{/* Description Section */}
						{course.description && course.description.trim() && course.description.trim() !== "null" && (
							<div className="bg-white/30 rounded-xl p-6 shadow-sm">
								<h3 className="text-2xl font-bold text-[#2e2e4f] mb-3 flex items-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Course Description
								</h3>
								<div className="prose prose-slate max-w-none 
									prose-headings:text-violet-900 prose-headings:font-bold 
									prose-p:mt-4 prose-p:mb-6 prose-p:leading-7
									prose-li:mt-2 prose-li:text-[#2e2e4f]/90
									prose-ul:mt-4 prose-ul:space-y-2
									prose-ul:list-none prose-ul:pl-4
									[&_br+•]:mt-2 [&_br+\d]:mt-2
									[&_•]:ml-4 [&_\d]:ml-4
									prose-strong:text-violet-700 prose-strong:font-semibold">
									<div
										className="text-lg leading-relaxed text-[#2e2e4f]/90 tracking-wide space-y-2"
										dangerouslySetInnerHTML={{
											__html: formatText(course.description)
										}}
									/>
								</div>
							</div>
						)}

						{/* Learning Outcomes Section */}
						<div className="bg-white/30 rounded-xl p-6 shadow-sm">
							<h3 className="text-2xl font-bold text-[#2e2e4f] mb-3 flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								Learning Outcomes
							</h3>
							{course.learning_outcomes && course.learning_outcomes.trim() && course.learning_outcomes.trim() !== "null" ? (
								<div className="prose prose-slate max-w-none 
									prose-headings:text-violet-900 prose-headings:font-bold 
									prose-p:mt-4 prose-p:mb-6 prose-p:leading-7
									prose-li:mt-2 prose-li:text-[#2e2e4f]/90
									prose-ul:mt-4 prose-ul:space-y-2
									prose-ul:list-none prose-ul:pl-4
									[&_br+•]:mt-2 [&_br+\d]:mt-2
									[&_•]:ml-4 [&_\d]:ml-4
									prose-strong:text-violet-700 prose-strong:font-semibold">
									<div
										className="text-lg leading-relaxed text-[#2e2e4f]/90 tracking-wide space-y-2"
										dangerouslySetInnerHTML={{
											__html: formatText(course.learning_outcomes)
										}}
									/>
								</div>
							) : (
								<p className="text-lg text-[#2e2e4f]/75 italic">
									No learning outcomes information available
								</p>
							)}
						</div>

						{/* Prerequisite Tree Section - Updated icon */}
						<div className="bg-white/30 rounded-xl p-6 shadow-sm">
							<h3 className="text-2xl font-bold text-[#2e2e4f] mb-3 flex items-center gap-2">
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									className="h-6 w-6" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path 
										strokeLinecap="round" 
										strokeLinejoin="round" 
										strokeWidth={2}
										d="M12 5v6m-3-3h6m-6 6h6"
									/>
								</svg>
								Prerequisite Graph Tree
							</h3>

							<div className="relative">
								<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
								<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
								<div className="relative rounded-lg p-4">
									{showOverlay && (
										<div
											className="absolute inset-0 z-10 bg-indigo-200/10 rounded-lg cursor-pointer 
													 flex items-center justify-center transition-all duration-300"
											onClick={(e) => {
												e.stopPropagation();
												setShowOverlay(false);
											}}
										>
											<span className="text-gray-500/15 font-medium text-4xl tracking-wider transform rotate-[-15deg]">
												Click to interact with the graph
											</span>
										</div>
									)}
									<div
										className="bg-indigo-300/20 outline-none focus:outline-none focus:ring-2 focus:ring-violet-600 
												 rounded-lg transition-shadow min-h-[300px] p-4"
										ref={treeRef}
										onClick={handleTreeClick}
										tabIndex={0}
									>
										{prerequisiteTree}
									</div>
								</div>
							</div>
						</div>

						{/* Prerequisites Section */}
						<div className="bg-white/30 rounded-xl p-6 shadow-sm">
							<h3 className="text-2xl font-bold text-[#2e2e4f] mb-3 flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
								Prerequisites
							</h3>
							{(course.prerequisites_text && course.prerequisites_text.trim() && course.prerequisites_text.trim() !== "null") ? (
								<div className="prose prose-slate max-w-none">
									<div
										className="text-lg leading-relaxed text-[#2e2e4f]/90 tracking-wide"
										dangerouslySetInnerHTML={{ __html: course.prerequisites_text }}
									/>
								</div>
							) : (
								<p className="text-lg text-[#2e2e4f]/75 italic">
									Prerequisites information not available
								</p>
							)}
						</div>
						<div class="mb-3 h-0.5 w-full bg-violet-500"></div>
						{/* Reviews Section */}
						{reviewPresenter && (
							<div className="bg-white/30 rounded-xl p-6 shadow-sm">
								<h3 className="text-2xl font-bold text-[#2e2e4f] mb-3 flex items-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									Reviews
								</h3>
								{reviewPresenter}
							</div>
						)}
					</div>
				</div>
				<button onClick={onClose} className="px-4 py-2 bg-violet-500 text-white">
					Close
				</button>
			</div>
		</div>
	);
}

export default CoursePagePopup;
