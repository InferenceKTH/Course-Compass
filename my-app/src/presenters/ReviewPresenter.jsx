import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ReviewView } from '../views/ReviewView.jsx';

/**
 * Presenter to handle the creation, deletion and synchronization of reviews for a course.
 */
export const ReviewPresenter = observer(({ model, course }) => {
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [anonState, setAnonState] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        overallRating: 0,
        difficultyRating: 0,
        professorName: "",
        professorRating: 0,
        grade: "",
        recommend: null,
        avgRating: 0,
    });

    // Fetch reviews when the current course code or model updates
    useEffect(() => {
        async function fetchReviews() {
            const data = await model.getReviews(course.code);
            setReviews(data);
        }
        fetchReviews();
    }, [course.code, model]);

    const hasPreviousReview = !!model?.user?.uid && reviews.some(r => r.uid === model.user.uid);

    // Set error message based on login state or review existence
    useEffect(() => {
        if (!model?.user?.uid) {
            setErrorMessage("You need to be logged in to post a review - Posting anonymously is possible.");
        } else if (hasPreviousReview) {
            setErrorMessage("Everyone can only post once. Submitting a new review will replace the old one.");
        } else {
            setErrorMessage("");
        }
    }, [reviews, model?.user?.uid, hasPreviousReview]);

    /**
     * Handle the submission of a review and set errors if needed.
     * @param {boolean} anon - whether to post anonymously
     */
    const handleReviewSubmit = async (anon) => {
        if (!model?.user) {
            setErrorMessage("You need to be logged in to post a comment - Posting anonymously is possible.");
            return;
        }

        if (!formData.text.trim() && formData.overallRating === 0) {
            setErrorMessage("Please provide either a review text or an overall rating.");
            return;
        }

        const review = {
            userName: anon ? "Anonymous" : model.user?.displayName,  
            uid: model?.user?.uid,
            userId: model?.user?.uid,
            timestamp: Date.now(),
            ...formData,
        };

        const success = await model.addReview(course.code, review);
        if (!success) {
            setErrorMessage("Something went wrong when posting. Are you logged in?");
            return;
        }

        const updatedReviews = await model.getReviews(course.code);
        setReviews(updatedReviews);

        setFormData({
            text: "",
            overallRating: 0,
            difficultyRating: 0,
            professorName: "",
            professorRating: 0,
            grade: "",
            recommend: null,
            avgRating: 0,
        });
    };

    return (
        <ReviewView
            course={course}
            reviews={reviews}
            formData={formData}
            setFormData={setFormData}
            handleReviewSubmit={handleReviewSubmit}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            hasPreviousReview={hasPreviousReview}
            anonState={anonState}
            setAnonState={setAnonState}
        />
    );
});
