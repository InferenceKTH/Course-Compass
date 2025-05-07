import React, { useState, useRef, useEffect } from "react";


import RatingComponent from "../views/Components/RatingComponent.jsx";

export function ReviewView(props) {
	const grades = ["🅰️", "B", "C", "D", "E", "F"];
	const {formData, setFormData} = props;
	const [showGradeOptions, setShowGradeOptions] = useState(false);
	const [showRecommendOptions, setShowRecommendOptions] = useState(false);
	const gradeRef = useRef(null);
	const recommendRef = useRef(null);


	useEffect(() => {
		function handleClickOutside(event) {
			if (gradeRef.current && !gradeRef.current.contains(event.target)) {
				setShowGradeOptions(false);
			}
			if (recommendRef.current && !recommendRef.current.contains(event.target)) {
				setShowRecommendOptions(false);
			}
		}
	
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	

	return (
		<div>
			<div className="mt-4">
				<div className="border border-black space-y-6 pb-4 mb-4">

				<div className="flex flex-wrap justify-center gap-6 mt-4">
		<div className="text-center">
			<p className="font-bold font-kanit mb-1">Overall rating</p>
			<RatingComponent
				className="flex gap-[2px] text-sm justify-center"
				value={formData.overallRating}
				onChange={(val) => setFormData({ ...formData, overallRating: val })}
			/>
		</div>

		<div className="text-center">
			<p className="font-bold font-kanit mb-1">Difficulty rating</p>
			<RatingComponent
				className="flex gap-[2px] text-sm justify-center"
				value={formData.difficultyRating}
				onChange={(val) => setFormData({ ...formData, difficultyRating: val })}
			/>
		</div>

		<div className="text-center">
			<p className="font-bold font-kanit mb-1">Professor rating</p>
			<RatingComponent
				className="flex gap-[2px] text-sm justify-center"
				value={formData.professorRating}
				onChange={(val) => setFormData({ ...formData, professorRating: val })}
			/>
		</div>
	</div>

					{/* <div className="center-align ">
						<p className="font-bold font-kanit items-center text-center">
							Overall rating
							<RatingComponent
							//
								className="flex gap-[2px] text-sm justify-center mb-1"
								value={formData.overallRating}
								onChange={(val) => setFormData({ ...formData, overallRating: val })}
							/>
						</p>
					</div> */}

					{/* <div>
						<p className="font-bold font-kanit items-center text-center">
							Difficulty rating
							<RatingComponent
								className="flex gap-[2px] text-sm justify-center"
								value={formData.difficultyRating}
								onChange={(val) => setFormData({ ...formData, difficultyRating: val })}
							/>
						</p>
					</div> */}

<div className="flex flex-col md:flex-row justify-center gap-8">

{/* Grade Section */}
<div className="relative" ref={gradeRef}>

<div className="flex-1 flex items-center justify-center gap-2">
	<p className="font-bold font-kanit text-center">Grade:</p>

	<div className="relative">
		{/* Box that triggers the popup */}
		<div
			className="px-2 py-1 border border-gray-300 rounded-sm text-sm cursor-pointer text-center"
			onClick={() => setShowGradeOptions((prev) => !prev)}
		>
			{formData.grade || "Select"}
		</div>

		{/* Popup options */}
		{showGradeOptions && (
			<div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg space-x-2 z-10 flex">
				{grades.map((grade) => (
					<button
						key={grade}
						onClick={() => {
							setFormData({ ...formData, grade });
							setShowGradeOptions(false);
						}}
						className={`px-4 py-2 rounded-md shadow-md ${
							formData.grade === grade
								? "bg-violet-600 text-white"
								: "bg-violet-200 hover:bg-violet-300"
						}`}
					>
						{grade}
					</button>
				))}
			</div>
		)}
	</div>
</div>

</div>

{/* Recommend Section */}
<div className="relative" ref={recommendRef}>


<div className="flex-1 flex items-center justify-center gap-2">
	<p className="font-bold font-kanit text-center">Recommend?</p>

	<div className="relative">
		{/* Box that triggers the popup */}
		<div
			className="px-2 py-1 border border-gray-300 rounded-sm text-sm cursor-pointer text-center"
			onClick={() => setShowRecommendOptions((prev) => !prev)}
		>
			{formData.recommend === null ? "Select" : formData.recommend ? "Yes" : "No"}
		</div>

		{/* Popup options */}
		{showRecommendOptions && (
			<div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg space-x-2 z-10 flex">
				<button
					onClick={() => {
						setFormData({ ...formData, recommend: true });
						setShowRecommendOptions(false);
					}}
					className={`px-4 py-2 rounded-md shadow-md ${
						formData.recommend
							? "bg-violet-600 text-white"
							: "bg-violet-200 hover:bg-violet-300"
					}`}
				>
					Yes
				</button>
				<button
					onClick={() => {
						setFormData({ ...formData, recommend: false });
						setShowRecommendOptions(false);
					}}
					className={`px-4 py-2 rounded-md shadow-md ${
						formData.recommend === false
							? "bg-violet-600 text-white"
							: "bg-violet-200 hover:bg-violet-300"
					}`}
				>
					No
				</button>
			</div>
		)}
	</div>
</div>
</div>
</div>



					<div>
						<p className="font-bold font-kanit items-center text-center">
							Professor Name & Rating
						</p>
						<div className="font-kanit flex justify-center mt-2">
							<input
								type="text"
								placeholder="Enter professor name"
								className="font-kanit border rounded-lg p-2 w-3/4 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
								value={formData.professorName}
								onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
							/>
						</div>
					</div>

					{/* <div>
						<p className="font-bold font-kanit items-center text-center">
							Professor Rating
							<RatingComponent
								className="flex gap-[2px] text-sm justify-center"
								value={formData.professorRating}
								onChange={(val) => setFormData({ ...formData, professorRating: val })}
							/>
						</p>
					</div> */}

					

				

					<div className="relative flex justify-center mt-2">
						<div className="w-3/4 relative">
       <textarea
		   value={formData.text}
		   onChange={(e) =>
			   setFormData({...formData, text: e.target.value})
		   }
		   placeholder="Write your review here..."
		   maxLength={2500}
		   className="font-kanit border rounded-lg p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm resize-none"
	   />
							<span className="absolute bottom-2 right-3 text-sm text-gray-500">
        							{formData.text.length}/2500
       						</span>
						</div>
					</div>
				</div>
				<button
					className="mt-2 bg-violet-600 text-white py-1 px-4 rounded"
					onClick={props.handleReviewSubmit}
				>
					Submit Review
				</button>
			</div>

			<div className="mt-6">
				<h3 className="font-bold text-lg mb-4">Previous Reviews</h3>
				<div className="space-y-6">
					{props.reviews.map((rev, i) => (
						<div key={i} className="border-b pb-4 mb-4">
							<p className="font-bold font-kanit items-center ">
								{rev.userName}
								<span
									className="font-normal text-sm text-violet-400">
									({new Date(rev.timestamp).toLocaleDateString()})
								</span>
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">

								<p className="font-bold font-kanit items-center text-center">
									Overall Rating
									<RatingComponent
										//
										className="flex space-x-1 text-sm justify-center mb-1"
										value={rev.overallRating}
										readOnly={true}
									/>
								</p>

								<p className="font-bold font-kanit items-center text-center">
									Difficulty Rating
									<RatingComponent
										value={rev.difficultyRating}
										readOnly={true}
									/>
								</p>

								<p className="font-bold font-kanit items-center text-center">
									Professor
									<p className="text-5xl text-violet-500 t-500 transition-transform duration-200 ">
										{rev.professorName}
									</p>
								</p>

								<p className="font-bold font-kanit items-center text-center">
									Professor Rating
									<RatingComponent className="font-bold font-kanit items-center text-center"
										value={rev.professorRating}
										readOnly={true}/>
								</p>

								<p className="font-bold font-kanit items-center text-center">
									Grade
									<p className="text-5xl text-violet-500 t-500 transition-transform duration-200 ">
										{rev.grade}
									</p>
								</p>

								<p className="font-bold font-kanit items-center text-center">
									Recommended
									<p className="text-5xl text-violet-500 t-500 transition-transform duration-200 ">
										{rev.recommend ? "👍" : "👎"}
									</p>
								</p>

							</div>
							<p className="font-bold font-kanit items-center text-center ">
								Review
								<p className="text-violet-500">
									{rev.text}
								</p>
							</p>

						</div>
					))}
					{props.reviews.length === 0 && <p>No reviews</p>}
				</div>
			</div>
		</div>
	);
}

export default ReviewView;