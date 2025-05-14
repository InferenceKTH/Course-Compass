import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ReviewView } from '../views/ReviewView.jsx';

/**
 * Presenter to handle the creation, deletion and synchronization of reviews for a course.
 */
export const ReviewPresenter = observer(({ model, course }) => {
    const [reviews, setReviews] = useState([]);
    const [postAnonymous, setAnonymous] = useState(false);
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

    // fetch reviews when the current course code or model updates.
    useEffect(() => {
        async function fetchReviews() {
            const data = await model.getReviews(course.code);
            setReviews(data);
        }
        fetchReviews();
    }, [course.code, model]);

    /**
     * Set an error message if the user is not logged in or posted already.
     */
    useEffect(() => {
        async function updateError() {
            if(!model?.user?.uid)
                setErrorMessage("You need to be logged in to post a comment - Posting anonymously is possible.");
            else if(reviews.filter((review)=>{return review.uid == model?.user?.uid}).length > 0)
                setErrorMessage("Everyone can only post once. Submitting a new comment will replace the old one.");
        }
        updateError();
    }, [reviews, model?.user?.uid]);

    /**
     * Handle the submssion of a review and set errors if needed.
     * @returns void
     */
    const handleReviewSubmit = async () => {
        if(!model?.user){
            setErrorMessage("You need to be logged in to post a comment - Posting anonymously is possible.");
            return;
        }

        if (!formData.text.trim() && formData.overallRating === 0) {
            setErrorMessage("Please provide either a review text or an overall rating.");
            return;
        }

        // create the post object - look into firebase rules if you want to change this.
        const review = {
            userName: postAnonymous ? "Anonymous" : model.user?.displayName,
            uid: model?.user?.uid,
            timestamp: Date.now(),
            ...formData,
        };
        
        if(!await model.addReview(course.code, review)){    
            setErrorMessage("Something went wrong when posting. Are you logged in?")
            return;
        }
        // refetch after submission
        const updatedReviews = await model.getReviews(course.code);
        setReviews(updatedReviews);
        setFormData({
            text: "",
            overallRating: 0,
            difficultyRating: 0,
            professorName: "",
            grade: "",
            recommended: false,
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
            postAnonymous={postAnonymous}
            setAnonymous={setAnonymous}
        />

    );
});
