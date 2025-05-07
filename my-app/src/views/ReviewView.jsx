import React from "react";
import RatingComponent from "../views/Components/RatingComponent.jsx";

export function ReviewView(props) {
	const grades = ["🅰️", "B", "C", "D", "E", "F"];
	const {formData, setFormData} = props;

	return (
		<div>
			<div className="mt-4">
				<div className="border border-black space-y-6 pb-4 mb-4">

					<div className="center-align ">
						<p className="font-bold font-kanit items-center text-center">
							Overall rating
							<RatingComponent
								value={formData.overallRating}
								onChange={(val) => setFormData({ ...formData, overallRating: val })}
							/>
						</p>
					</div>

					<div>
						<p className="font-bold font-kanit items-center text-center">
							Difficulty rating
							<RatingComponent
								value={formData.difficultyRating}
								onChange={(val) => setFormData({ ...formData, difficultyRating: val })}
							/>
						</p>
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

					<div>
						<p className="font-bold font-kanit items-center text-center">
							Professor Rating
							<RatingComponent
								value={formData.professorRating}
								onChange={(val) => setFormData({ ...formData, professorRating: val })}
							/>
						</p>
					</div>

					<div>
						<p className="font-bold font-kanit items-center text-center">Grade</p>
						<div className="flex font-kanit justify-center space-x-2 mt-2">
							{grades.map((grade) => (
								<button
									key={grade}
									onClick={() => setFormData({ ...formData, grade })}
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
					</div>

					<div>
						<p className="font-bold font-kanit items-center text-center">
							Would you recommend this course?
						</p>
						<div className="flex font-kanit justify-center space-x-2 mt-2">
							<button
								onClick={() => setFormData({ ...formData, recommend: true })}
								className={`px-4 py-2 rounded-md shadow-md ${
									formData.recommend
										? "bg-violet-600 text-white"
										: "bg-violet-200 hover:bg-violet-300"
								}`}
							>
								Yes
							</button>
							<button
								onClick={() => setFormData({ ...formData, recommend: false })}
								className={`px-4 py-2 rounded-md shadow-md ${
									formData.recommend === false
										? "bg-violet-600 text-white"
										: "bg-violet-200 hover:bg-violet-300"
								}`}
							>
								No
							</button>
						</div>

					</div>

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