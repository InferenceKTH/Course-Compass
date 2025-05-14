import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ReviewView } from '../views/ReviewView.jsx';

export const ReviewPresenter = observer(({ model, course }) => {
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
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

    useEffect(() => {
        async function fetchReviews() {
            const data = await model.getReviews(course.code);
            setReviews(data);
        }
        fetchReviews();
    }, [course.code, model]);

    const hasPreviousReview = !!model?.user?.uid && reviews.some(r => r.uid === model.user.uid);

    useEffect(() => {
        if (!model?.user?.uid) {
            setErrorMessage("You need to be logged in to post a review - Posting anonymously is possible.");
        } else if (hasPreviousReview) {
            setErrorMessage("Everyone can only post once. Submitting a new review will replace the old one.");
        } else {
            setErrorMessage(""); 
        }
    }, [reviews, model?.user?.uid, hasPreviousReview]);

    const handleReviewSubmit = async (anonState) => {
        if (!model?.user) {
            setErrorMessage("You need to be logged in to post a review - Posting anonymously is possible.");
            return;
        }

        if (!formData.text.trim() && formData.overallRating === 0) {
            setErrorMessage("Please provide either a review text or an overall rating.");
            return;
        }

        const review = {
            userName: anonState ? "Anonymous" : model.user?.displayName,
            uid: model?.user?.uid,
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
        />
    );
});
