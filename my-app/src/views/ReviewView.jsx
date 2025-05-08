import React, { useState, useRef, useEffect } from "react";
import RatingComponent from "../views/Components/RatingComponent.jsx";

export function ReviewView(props) {
  const grades = ["A", "B", "C", "D", "E", "F"];
  const { formData, setFormData } = props;
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
    <div className="max-w-5xl mx-auto">
      <div className="mt-12">
        <div className="bg-white shadow-lg rounded-2xl p-12 mb-12">
          <div className="flex flex-wrap justify-center gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-lg mb-2">Overall Rating</p>
              <RatingComponent
                className="flex gap-2 text-2xl justify-center"
                value={formData.overallRating}
                onChange={(val) => setFormData({ ...formData, overallRating: val })}
              />
            </div>

            {/* Difficulty Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-lg mb-2">Difficulty Rating</p>
              <RatingComponent
                className="flex gap-2 text-2xl justify-center"
                value={formData.difficultyRating}
                onChange={(val) => setFormData({ ...formData, difficultyRating: val })}
              />
            </div>

            {/* Professor Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-lg mb-2">Professor Rating</p>
              <RatingComponent
                className="flex gap-2 text-2xl justify-center"
                value={formData.professorRating}
                onChange={(val) => setFormData({ ...formData, professorRating: val })}
              />
            </div>

            {/* Grade Section */}
            <div className="relative" ref={gradeRef}>
              <div className="flex items-center justify-center gap-4">
                <p className="font-semibold text-gray-700 text-lg">Grade:</p>
                <div className="relative">
                  <div
                    className="px-6 py-3 border border-gray-300 rounded-lg text-lg cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowGradeOptions((prev) => !prev)}
                  >
                    {formData.grade || "Select"}
                  </div>
                  {showGradeOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white p-4 rounded-xl shadow-xl z-10 flex space-x-4 animate-fadeIn">
                      {grades.map((grade) => (
                        <button
                          key={grade}
                          onClick={() => {
                            setFormData({ ...formData, grade });
                            setShowGradeOptions(false);
                          }}
                          className={`px-6 py-2 rounded-lg text-lg ${
                            formData.grade === grade
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } transition-colors duration-200`}
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
              <div className="flex items-center justify-center gap-4">
                <p className="font-semibold text-gray-700 text-lg">Recommend?</p>
                <div className="relative">
                  <div
                    className="px-6 py-3 border border-gray-300 rounded-lg text-lg cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowRecommendOptions((prev) => !prev)}
                  >
                    {formData.recommend === null ? "Select" : formData.recommend ? "Yes" : "No"}
                  </div>
                  {showRecommendOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white p-4 rounded-xl shadow-xl z-10 flex space-x-4 animate-fadeIn">
                      <button
                        onClick={() => {
                          setFormData({ ...formData, recommend: true });
                          setShowRecommendOptions(false);
                        }}
                        className={`px-6 py-2 rounded-lg text-lg ${
                          formData.recommend ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                        } transition-colors duration-200`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, recommend: false });
                          setShowRecommendOptions(false);
                        }}
                        className={`px-6 py-2 rounded-lg text-lg ${
                          formData.recommend === false ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                        } transition-colors duration-200`}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Enter professor name"
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg p-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-colors duration-200"
              value={formData.professorName}
              onChange={(e) => setFormData({ ...formData, professorName: e.target.value })}
            />
          </div>

          <div className="relative mt-8">
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Write your review here..."
              maxLength={2500}
              className="w-full border border-gray-300 rounded-lg p-4 text-lg h-64 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none transition-colors duration-200"
            />
            <span className="absolute bottom-4 right-5 text-sm text-gray-500">
              {formData.text.length}/2500
            </span>
          </div>

          <button
            className="mt-8 w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-colors duration-200 text-xl"
            onClick={props.handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-8">Previous Reviews</h3>
          <div className="space-y-12">
            {[...props.reviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((rev, i) => (
              <div key={i} className="bg-white shadow-lg rounded-2xl p-10">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-800 text-xl">{rev.userName}</p>
                  <p className="text-lg text-gray-500">
                    Posted on {new Date(rev.timestamp).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-4 text-lg">
                  <div>
                    <p className="font-semibold text-gray-700">Overall Rating</p>
                    {rev.overallRating > 0 ? (
                      <RatingComponent
                        className="flex space-x-2 text-xl"
                        value={rev.overallRating}
                        readOnly={true}
                      />
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Difficulty Rating</p>
                    {rev.difficultyRating > 0 ? (
                      <RatingComponent
                        className="flex space-x-2 text-xl"
                        value={rev.difficultyRating}
                        readOnly={true}
                      />
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Professor Rating</p>
                    {rev.professorRating > 0 ? (
                      <RatingComponent
                        className="flex space-x-2 text-xl"
                        value={rev.professorRating}
                        readOnly={true}
                      />
                    ) : (
                      <p className="text-gray-600">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Professor</p>
                    <p className="text-gray-600">{rev.professorName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Grade</p>
                    <p className="text-gray-600">{rev.grade || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Recommended</p>
                    <p className="text-gray-600">
                      {rev.recommend === true ? "Yes" : rev.recommend === false ? "No" : "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-lg mb-1">Review</p>
                  <p className="text-gray-600 text-lg">{rev.text}</p>
                </div>
              </div>
            ))}
            {props.reviews.length === 0 && <p className="text-lg text-gray-600">No reviews yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewView;
