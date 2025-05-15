import React, { useState } from "react";
import RatingComponent from "./RatingComponent.jsx";
import { model } from "../../model.js";
import { addReviewForCourse, deleteReviewById } from "../../firebase"; // we will add deleteReviewById

function CommentTree({ courseCode, comment, level = 0 }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const currentUserId = model.user?.uid;

  const handleReplySubmit = async () => {
    if (replyText.trim().length === 0) return;

    const reply = {
      userName: model.user?.displayName || "Anonymous",
      userId: model.user?.uid || "anonymous",
      text: replyText,
      timestamp: Date.now(),
      overallRating: 0,
      difficultyRating: 0,
      professorRating: 0,
      professorName: "",
      grade: "",
      recommend: null,
    };

    await addReviewForCourse(courseCode, reply, comment.id);
    window.location.reload(); // quick reload for now
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    await deleteReviewById(courseCode, comment.id, comment.parentId || null);
    window.location.reload(); // quick reload
  };

  return (
    <div className="ml-4 mt-4 border-l pl-4 border-gray-300">
      <div className="bg-gray-50 p-3 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-gray-800">{comment.userName}</p>
          <p className="text-xs text-gray-500">
            {new Date(comment.timestamp).toLocaleDateString()}
          </p>
        </div>

        <p className="text-sm text-gray-700 mb-1">{comment.text}</p>

        <div className="flex gap-3 items-center">
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setShowReply(!showReply)}
          >
            {showReply ? "Cancel" : "Reply"}
          </button>

          {/* Show delete button only if current user is the comment author */}
          {currentUserId && comment.userId === currentUserId && (
            <button
              className="text-red-500 text-sm hover:underline"
              onClick={handleDeleteComment}
            >
              Delete
            </button>
          )}
        </div>

        {showReply && (
          <div className="mt-2">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={handleReplySubmit}
              className="mt-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post Reply
            </button>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((child) => (
            <CommentTree
              key={child.id}
              courseCode={courseCode}
              comment={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentTree;
