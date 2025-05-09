import React, { useState, useRef, useEffect } from "react";
import RatingComponent from "../views/Components/RatingComponent.jsx";

export function ReviewView(props) {
  const grades = ["A", "B", "C", "D", "E", "F"];
  const difficulties = ["Easy", "Medium", "Hard"];
  const { formData, setFormData } = props;
  const [showGradeOptions, setShowGradeOptions] = useState(false);
  const [showRecommendOptions, setShowRecommendOptions] = useState(false);
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showPostAnonymously, setShowPostAnonymously] = useState(false);
  const [anonState, setAnonState] = useState(props.postAnonymously);
  const gradeRef = useRef(null);
  const recommendRef = useRef(null);
  const difficultyRef = useRef(null);
  const anonymousRef = useRef(null);

  // Function to get user initials from their name
  const getInitials = (name) => {
    if (!name) return "N/A";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() || "N/A";
    return `${words[0][0]?.toUpperCase() || ""}${
      words[words.length - 1][0]?.toUpperCase() || ""
    }`;
  };

  // Function to map numeric difficultyRating to Easy/Medium/Hard
  const mapDifficultyRating = (rating) => {
    if (!rating || rating === 0) return "N/A";
    if (rating <= 2) return "Easy";
    if (rating === 3) return "Medium";
    return "Hard";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (gradeRef.current && !gradeRef.current.contains(event.target)) {
        setShowGradeOptions(false);
      }
      if (recommendRef.current && !recommendRef.current.contains(event.target)) {
        setShowRecommendOptions(false);
      }
      if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
        setShowDifficultyOptions(false);
      }
      if (anonymousRef.current && !anonymousRef.current.contains(event.target)) {
        setShowPostAnonymously(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setAnonState(props.postAnonymously);
  }, [props.postAnonymously]);

  // Function to toggle expanded state for a review
  const toggleExpanded = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mt-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            {/* Overall Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-sm mb-1">
                Overall Rating
              </p>
              <RatingComponent
                className="flex gap-1 text-base justify-center"
                value={formData.overallRating}
                onChange={(val) =>
                  setFormData({ ...formData, overallRating: val })
                }
              />
            </div>

            {/* Difficulty Rating */}
            <div className="relative" ref={difficultyRef}>
              <div className="flex items-center justify-center gap-2">
                <p className="font-semibold text-gray-700 text-sm">Difficulty:</p>
                <div className="relative">
                  <div
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowDifficultyOptions((prev) => !prev)}
                  >
                    {formData.difficultyRating || "Select"}
                  </div>
                  {showDifficultyOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg z-10 flex space-x-2 animate-fadeIn">
                      {difficulties.map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => {
                            setFormData({ ...formData, difficultyRating: difficulty });
                            setShowDifficultyOptions(false);
                          }}
                          className={`px-3 py-1 rounded-md text-sm ${
                            formData.difficultyRating === difficulty
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          } transition-colors duration-200`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professor Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-sm mb-1">
                Professor Rating
              </p>
              <RatingComponent
                className="flex gap-1 text-base justify-center"
                value={formData.professorRating}
                onChange={(val) =>
                  setFormData({ ...formData, professorRating: val })
                }
              />
            </div>

            {/* Grade Section */}
            <div className="relative" ref={gradeRef}>
              <div className="flex items-center justify-center gap-2">
                <p className="font-semibold text-gray-700 text-sm">Grade:</p>
                <div className="relative">
                  <div
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowGradeOptions((prev) => !prev)}
                  >
                    {formData.grade || "Select"}
                  </div>
                  {showGradeOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg z-10 flex space-x-2 animate-fadeIn">
                      {grades.map((grade) => (
                        <button
                          key={grade}
                          onClick={() => {
                            setFormData({ ...formData, grade });
                            setShowGradeOptions(false);
                          }}
                          className={`px-3 py-1 rounded-md text-sm ${
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
              <div className="flex items-center justify-center gap-2">
                <p className="font-semibold text-gray-700 text-sm">Recommend?</p>
                <div className="relative">
                  <div
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setShowRecommendOptions((prev) => !prev)}
                  >
                    {formData.recommend === null
                      ? "Select"
                      : formData.recommend
                      ? "Yes"
                      : "No"}
                  </div>
                  {showRecommendOptions && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg z-10 flex space-x-2 animate-fadeIn">
                      <button
                        onClick={() => {
                          setFormData({ ...formData, recommend: true });
                          setShowRecommendOptions(false);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          formData.recommend
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        } transition-colors duration-200`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, recommend: false });
                          setShowRecommendOptions(false);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          formData.recommend === false
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
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
          {/* Anonymous Section */}
          <div className="relative" ref={anonymousRef}>
            <div className="flex items-center justify-center gap-2 mt-4">
              <p className="font-semibold text-gray-700 text-sm">
                Post Anonymously?
              </p>
              <div className="relative">
                <div
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm cursor-pointer text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setShowPostAnonymously((prev) => !prev)}
                >
                  {anonState ? "Yes" : "No"}
                </div>
                {showPostAnonymously && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-md shadow-lg z-10 flex space-x-2 animate-fadeIn">
                    <button
                      onClick={() => {
                        props.setAnonymous(true);
                        setAnonState(true);
                        setShowPostAnonymously(false);
                      }}
                      className={`px-3 py-1 rounded-md text-sm ${
                        props.postAnonymously
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      } transition-colors duration-200`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        props.setAnonymous(false);
                        setAnonState(false);
                        setShowPostAnonymously(false);
                      }}
                      className={`px-3 py-1 rounded-md text-sm ${
                        props.postAnonymously === false
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      } transition-colors duration-200`}
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter professor name"
              maxLength={100}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              value={formData.professorName}
              onChange={(e) =>
                setFormData({ ...formData, professorName: e.target.value })
              }
            />
          </div>

          <div className="relative mt-4">
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Write your review here..."
              maxLength={2500}
              className="w-full border border-gray-300 rounded-md p-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200"
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-500">
              {formData.text.length}/2500
            </span>
          </div>
          {props.errorMessage && (
            <div className="mt-4 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm">
              {props.errorMessage}
            </div>
          )}
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={props.handleReviewSubmit}
          >
            Submit Review
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Reviews</h3>
          <div className="space-y-6">
            {[...props.reviews]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((rev, i) => {
                const maxLength = 200;
                const isLongReview = rev.text.length > maxLength;
                const isExpanded = expandedReviews[i] || false;

                return (
                  <div key={i} className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {getInitials(rev.userName)}
                        </div>
                        <p className="font-semibold text-gray-800">{rev.userName}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Posted on{" "}
                        {new Date(rev.timestamp).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Overall Rating</p>
                        {rev.overallRating > 0 ? (
                          <RatingComponent
                            className="flex space-x-1 text-sm"
                            value={rev.overallRating}
                            readOnly={true}
                          />
                        ) : (
                          <p className="text-sm text-gray-600">N/A</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Difficulty</p>
                        <p className="text-sm text-gray-600">{mapDifficultyRating(rev.difficultyRating)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Professor Rating</p>
                        {rev.professorRating > 0 ? (
                          <RatingComponent
                            className="flex space-x-1 text-sm"
                            value={rev.professorRating}
                            readOnly={true}
                          />
                        ) : (
                          <p className="text-sm text-gray-600">N/A</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Professor</p>
                        <p className="text-sm text-gray-600">{rev.professorName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Grade</p>
                        <p className="text-sm text-gray-600">{rev.grade || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Recommended</p>
                        <p className="text-sm text-gray-600">
                          {rev.recommend === true ? "Yes" : rev.recommend === false ? "No" : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Review</p>
                      <div
                        className={`text-sm text-gray-600 transition-all duration-300 ${
                          isExpanded || !isLongReview ? "" : "max-h-10 overflow-hidden"
                        }`}
                      >
                        {isExpanded || !isLongReview
                          ? rev.text
                          : `${rev.text.slice(0, maxLength)}...`}
                      </div>
                      {isLongReview && (
                        <button
                          onClick={() => toggleExpanded(i)}
                          className="mt-1 text-blue-600 hover:text-blue-800 text-sm font-semibold focus:outline-none"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            {props.reviews.length === 0 && <p className="text-sm text-gray-600">No reviews yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewView;