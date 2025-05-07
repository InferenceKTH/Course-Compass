import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ReviewView } from '../views/ReviewView.jsx';

export const ReviewPresenter = observer(({ model, course }) => {
    const [reviews, setReviews] = useState([]);
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

    const handleReviewSubmit = async () => {
        if (formData.text.trim()) {
            const review = {
                userName: model.user?.displayName || "Anonymous",
                timestamp: Date.now(),
                ...formData,
            };
            await model.addReview(course.code, review);
            const updatedReviews = await model.getReviews(course.code);
            setReviews(updatedReviews);
            setFormData({
                text: "",
                overallRating: 0,
                difficultyRating: 0,
                professor: "",
                grade: "",
                recommended: false,
                avgRating: 0,
            });
        }
    };


    return (
        <ReviewView
            course={course}
            reviews={reviews}
            formData={formData}
            setFormData={setFormData}
            handleReviewSubmit={handleReviewSubmit}
        />

    );
});
