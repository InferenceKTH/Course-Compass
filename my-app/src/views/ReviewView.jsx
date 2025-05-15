import React, { useState, useRef, useEffect } from "react";
import RatingComponent from "../views/Components/RatingComponent.jsx";
import { getCommentsForReview, addCommentToReview, auth } from "../../firebase";
import { deleteReview, deleteComment } from "../../firebase";


/**
 * Displays the user an interface to give a review for a specified course. Invoked by the ReviewPresenter.
 * @param {*} props 
 * @returns 
 */
export function ReviewView(props) {
  const grades = ["A", "B", "C", "D", "E", "F"];
  const difficulties = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];
  const { formData, setFormData } = props;
  const [showGradeOptions, setShowGradeOptions] = useState(false);
  const [showRecommendOptions, setShowRecommendOptions] = useState(false);
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [commentsByReview, setCommentsByReview] = useState({});
  const [commentAnonState, setCommentAnonState] = useState({});
  const [anonState, setAnonState] = useState(false); // local anonymous state

  useEffect(() => {
    async function fetchComments() {
      const result = {};
      for (let rev of props.reviews) {
        const list = await getCommentsForReview(rev.courseCode, rev.uid);
        result[rev.uid] = list;
      }
      setCommentsByReview(result);
    }
    if (props.reviews?.length) fetchComments();
  }, [props.reviews]);

  useEffect(() => {
    async function fetchComments() {
      const result = {};
      for (let rev of props.reviews) {
        const list = await getCommentsForReview(rev.courseCode, rev.uid);
        result[rev.uid] = list;
      }
      setCommentsByReview(result);
    }
    if (props.reviews?.length) fetchComments();
  }, [props.reviews]);

  const gradeRef = useRef(null);
  const recommendRef = useRef(null);
  const difficultyRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "N/A";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase() || "N/A";
    return `${words[0][0]?.toUpperCase() || ""}${words[words.length - 1][0]?.toUpperCase() || ""}`;
    return `${words[0][0]?.toUpperCase() || ""}${words[words.length - 1][0]?.toUpperCase() || ""}`;
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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleExpanded = (index) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCommentSubmit = async (rev) => {
    const text = (commentTexts[rev.uid] || "").trim();
    if (!text) return;

    const userId = auth.currentUser?.uid || "anonymous";

    // Load existing comments for this review
    const updated = await getCommentsForReview(rev.courseCode, rev.uid);

    // Count how many comments this user has made
    const userComments = updated.filter(c => c.userId === userId);
    if (userComments.length >= 3) {
      alert("You can only post up to 3 comments under each review.");
      return;
    }

    const isAnonymous =
      commentAnonState?.[rev.uid] || !auth.currentUser?.displayName;

    const comment = {
      userId: userId,
      userName: isAnonymous ? "Anonymous" : auth.currentUser.displayName,
      text,
      timestamp: Date.now(),
    };

    await addCommentToReview(rev.courseCode, rev.uid, comment);
    const refreshed = await getCommentsForReview(rev.courseCode, rev.uid);
    setCommentsByReview((prev) => ({ ...prev, [rev.uid]: refreshed }));
    setCommentTexts((prev) => ({ ...prev, [rev.uid]: "" }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mt-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            {/* Overall Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-sm mb-1">Overall Rating</p>
              <RatingComponent
                className="flex gap-1 text-base justify-center"
                value={formData.overallRating}
                onChange={(val) => setFormData({ ...formData, overallRating: val })}
                onChange={(val) => setFormData({ ...formData, overallRating: val })}
              />
            </div>

            {/* Professor Rating */}
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-sm mb-1">Professor Rating</p>
              <RatingComponent
                className="flex gap-1 text-base justify-center"
                value={formData.professorRating}
                onChange={(val) => setFormData({ ...formData, professorRating: val })}
                onChange={(val) => setFormData({ ...formData, professorRating: val })}
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

          {/* Professor name */}

          {/* Professor name */}
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

          {/* Review text input */}
          {/* Review text input */}
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

          {/* Error and Anonymous Section */}
          <div className="mt-2 flex flex-col gap-2">
            {!auth.currentUser && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                You need to be logged in to post a review – Posting anonymously is possible.
              </div>
            )}
            {auth.currentUser && props.hasPreviousReview && (
              <div className="w-full bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md text-sm">
                You have already submitted a review. Submitting again will <strong>replace</strong> your previous one.
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anon-main-review"
                className="mr-2"
                checked={anonState}
                onChange={() => setAnonState((prev) => !prev)}
              />
              <label htmlFor="anon-main-review" className="text-sm text-gray-700">
                Post anonymously
              </label>
            </div>
          </div>

          </div>

          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={() => props.handleReviewSubmit(anonState)}
            onClick={() => props.handleReviewSubmit(anonState)}
          >
            
            Submit Review
          </button>
        </div>

        {/* Previous Reviews */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Reviews</h3>
          <div className="space-y-6">
            {props.reviews.length === 0 ? (
              <p className="text-sm text-gray-600">No reviews yet.</p>
            ) : (
              [...props.reviews]
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

      {/* Show delete button if current user is the author */}
      {auth.currentUser?.uid === rev.userId && (
        <button
          onClick={async () => {
            const confirmed = window.confirm("Are you sure you want to delete this review?");
            if (!confirmed) return;
            await deleteReview(rev.courseCode, rev.userId);
            window.location.reload(); // Optional: replace with props.refresh() if you have it
          }}
          className="text-red-500 text-xs ml-3 hover:underline"
        >
          Delete
        </button>
      )}
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
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Overall Rating</p>
                          {rev.overallRating > 0 ? (
                            <RatingComponent
                              className="flex space-x-1 text-sm mt-1"
                              value={rev.overallRating}
                              readOnly={true}
                            />
                          ) : (
                            <p className="text-sm text-gray-600 mt-1">N/A</p>
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Professor Rating</p>
                          {rev.professorRating > 0 ? (
                            <RatingComponent
                              className="flex space-x-1 text-sm mt-1"
                              value={rev.professorRating}
                              readOnly={true}
                            />
                          ) : (
                            <p className="text-sm text-gray-600 mt-1">N/A</p>
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Difficulty</p>
                          <p className="text-sm text-gray-600 mt-1">{rev.difficultyRating || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Professor</p>
                          <p className="text-sm text-gray-600 mt-1">{rev.professorName || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Grade</p>
                          <p className="text-sm text-gray-600 mt-1">{rev.grade || "N/A"}</p>
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold text-gray-700">Recommended</p>
                          <p className="text-sm text-gray-600 mt-1">
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

                      {/* Comment Section */}
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Add a Comment</p>
                        <textarea
                          placeholder="Write your comment here..."
                          value={commentTexts[rev.uid] || ""}
                          onChange={(e) =>
                            setCommentTexts((prev) => ({ ...prev, [rev.uid]: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />

                        {!auth.currentUser && (
                          <div className="mt-2 w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
                            You need to be logged in to post a comment – Posting anonymously is possible.
                          </div>
                        )}

                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`anon-${rev.uid}`}
                            className="mr-2"
                            checked={commentAnonState?.[rev.uid] || false}
                            onChange={() =>
                              setCommentAnonState((prev) => ({
                                ...prev,
                                [rev.uid]: !prev?.[rev.uid],
                              }))
                            }
                          />
                          <label htmlFor={`anon-${rev.uid}`} className="text-sm text-gray-700">
                            Post anonymously
                          </label>
                        </div>

                        <button
                          onClick={() => handleCommentSubmit(rev)}
                          className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-sm"
                        >
                          Submit Comment
                        </button>

                        {/* Comment List */}
                        {commentsByReview[rev.uid] && commentsByReview[rev.uid].length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Comments:</p>
                            {commentsByReview[rev.uid].map((comment, idx) => (
                              <div
                                key={idx}
                                className="ml-4 bg-gray-100 p-2 rounded text-sm text-gray-700 border border-gray-200"
                              >
<div className="text-xs text-gray-500 italic mb-1 flex justify-between items-center">
  <span>
    Replying to <span className="font-semibold">{rev.userName}</span>
  </span>

  {auth.currentUser?.uid === comment.userId && (
    <button
      onClick={async () => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;
        await deleteComment(rev.courseCode, rev.uid, comment.id);
        const refreshed = await getCommentsForReview(rev.courseCode, rev.uid);
        setCommentsByReview((prev) => ({ ...prev, [rev.uid]: refreshed }));
      }}
      className="text-red-500 text-xs ml-2 hover:underline"
    >
      Delete
    </button>
  )}
</div>

                                <div className="flex items-start gap-2">
                                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                                    {getInitials(comment.userName)}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-xs">{comment.userName}:</span>
                                    <span className="ml-2 text-sm">{comment.text}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
  );
}

export default ReviewView;
